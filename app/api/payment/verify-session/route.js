import { NextResponse } from "next/server";
import databaseConnection from "@/lib/dbConfig";
import Booking from "@/models/bookingModel";
import { paymentSuccessfulClientTemplate, paymentSuccessfulConsultantTemplate } from "@/mail/paymentSuccessfulTemplate";
import { mailSender } from "@/utils/mailSender";
import User from "@/models/userModel";
const sendPaymentSuccessfulEmail = async (role,email, bookingDetails)=>{
  try {
     const {clientName, consultantName, bookingId, amount} = bookingDetails;
     let emailBody;
     if(role === "Client"){
       emailBody = paymentSuccessfulClientTemplate(clientName , consultantName,  bookingId, amount);
     } else if(role === "Consultant"){
       emailBody = paymentSuccessfulConsultantTemplate(clientName , consultantName,  bookingId, amount);
     }
     
     const mailResponse = await mailSender(
       "Payment Successful - TrustConsult",
       email,
       emailBody
     )
    // console.log("Mail response: ",mailResponse)
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
}

export async function GET(req) {
  try {
    await databaseConnection();
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");
    if (!sessionId)
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" });

    //  Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session?.payment_status || session.payment_status !== "paid") {
      return NextResponse.json({ paid: false });
    }

    //  Extract bookingId from metadata
    const bookingId = session.metadata?.bookingId;
    if (!bookingId)
      return NextResponse.json({ error: "No bookingId in metadata" }, { status: 400 });

    //  Update booking in MongoDB
    const updated = await Booking.findByIdAndUpdate(
      bookingId,
      { paymentStatus: "paid" },
      { new: true }
    );

    if (!updated)
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    const Client = await User.findById(updated.clientId);
    const Consultant = await User.findById(updated.consultantId);

    sendPaymentSuccessfulEmail("Client",Client.email,{
      clientName: Client.firstName + " " + Client.lastName,
      consultantName: Consultant.firstName + " " + Consultant.lastName,
      bookingId: updated._id,
      amount: session.amount_total / 100
    })
    sendPaymentSuccessfulEmail("Consultant",Consultant.email,{
      clientName: Client.firstName + " " + Client.lastName,
      consultantName: Consultant.firstName + " " + Consultant.lastName,
      bookingId: updated._id,
      amount: session.amount_total / 100
    })
    return NextResponse.json({ paid: true, booking: updated });
  } catch (error) {
    console.error("Stripe verify error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
