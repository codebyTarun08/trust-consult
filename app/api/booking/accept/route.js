import { NextResponse } from "next/server";
import databaseConnection from "@/lib/dbConfig";
import Booking from "@/models/bookingModel";
import { bookingConfirmedTemplate } from "@/mail/bookingConfirmedTemplate";
import { mailSender } from "@/utils/mailSender";
import User from "@/models/userModel";

const sendBookingConfirmationEmail = async (email, bookingDetails)=>{
  try {
     const {clientName , bookingId, consultantName, date,startHour, endHour} = bookingDetails;
     const emailBody = bookingConfirmedTemplate(clientName , bookingId, consultantName, date,startHour, endHour);
     const mailResponse = await mailSender(
       "Booking Confirmed!! - TrustConsult",
       email,
       emailBody
     )
    // console.log("Mail response: ",mailResponse)
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
}
export async function PUT(req) {
  try {
    await databaseConnection();

    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID required" }, { status: 400 });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    if (booking.status !== "pending") {
      return NextResponse.json({ error: "Booking already processed" }, { status: 400 });
    }
    const Client = await User.findById(booking.clientId);
    const Consultant = await User.findById(booking.consultantId);

    if (!Client || !Consultant) {
      return NextResponse.json({ error: "Client or Consultant not found" }, { status: 404 });
    }

    booking.status = "confirmed";
    await booking.save();

    sendBookingConfirmationEmail(Client.email, {
      clientName: Client.firstName + " " + Client.lastName,
      bookingId: booking._id,
      consultantName: Consultant.firstName + " " + Consultant.lastName,
      date: booking.slot.date,
      startHour: booking.slot.startHour,
      endHour: booking.slot.endHour
    });

    return NextResponse.json(
      { message: "Booking accepted successfully", booking, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error accepting booking:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
