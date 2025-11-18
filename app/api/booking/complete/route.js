import { NextResponse } from "next/server";
import databaseConnection from "@/lib/dbConfig";
import Booking from "@/models/bookingModel";
import User from "@/models/userModel";
import { bookingCompletedTemplate } from "@/mail/bookingCompletedTemplate";

const sendBookingCompletedEmail = async (email,clientName, consultantName)=>{
  try {
    const emailBody = bookingCompletedTemplate(clientName, consultantName);
    const subject = "Your Consultation is Completed - Next Steps Inside!";
    const mailResponse = await mailSender(subject, email, emailBody);
    //console.log("Mail Response: ", mailResponse);
  } catch (error) {
    console.error("Error sending booking completed email:", error);
  }
}
export async function PUT(req) {
  try {
    await databaseConnection();
    const { bookingId } = await req.json();
    if (!bookingId) return NextResponse.json({ error: "Booking ID required" }, { status: 400 });

    const booking = await Booking.findById(bookingId);
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    booking.status = "completed";
    await booking.save();
    const Client = await User.findById(booking.clientId);
    const Consultant = await User.findById(booking.consultantId);
    sendBookingCompletedEmail(Client.email, Client.firstName, Consultant.firstName);
    return NextResponse.json({ success: true, booking });
  } catch (e) {
    console.error("Complete booking error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


