import { NextResponse } from "next/server";
import databaseConnection from "@/lib/dbConfig";
import Booking from "@/models/bookingModel";
import { mailSender } from "@/utils/mailSender";
import User from "@/models/userModel";
import { bookingCancelledTemplate } from "@/mail/bookingCancelledTemplate";

const sendBookingCancellationEmail = async (email, bookingDetails)=>{
  try {
     const {clientName, consultantName, date, startHour, endHour, reason} = bookingDetails;
     const emailBody = bookingCancelledTemplate(clientName , consultantName, date,startHour, endHour, reason);
     const mailResponse = await mailSender(
       "Booking Cancelled!! - TrustConsult",
       email,
       emailBody
     )
     //console.log("Mail response: ",mailResponse)
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
}
export async function PUT(req) {
  try {
    await databaseConnection();

    const { bookingId, reason } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID required" }, { status: 400 });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    if (booking.status === "completed") {
      return NextResponse.json({ error: "Completed bookings cannot be cancelled" }, { status: 400 });
    }
    const Client = await User.findById(booking.clientId);
    const Consultant = await User.findById(booking.consultantId);

    if (!Client || !Consultant) {
      return NextResponse.json({ error: "Client or Consultant not found" }, { status: 404 });
    }

    booking.status = "cancelled";
    booking.cancelReason = reason || "Cancelled by consultant";
    await booking.save();

    sendBookingCancellationEmail(Client.email,{
      clientName: Client.firstName + " " + Client.lastName,
      bookingId: booking._id,
      consultantName: Consultant.firstName + " " + Consultant.lastName,
      date: booking.slot.date,
      startHour: booking.slot.startHour,
      endHour: booking.slot.endHour,
      reason: reason
    })

    return NextResponse.json(
      { message: "Booking cancelled successfully", booking, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
