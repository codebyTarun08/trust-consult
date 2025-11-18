// import { NextResponse } from "next/server";
// import databaseConnection from "@/lib/dbConfig";
// import Booking from "@/models/bookingModel";
// import Review from "@/models/reviewModel";
// import User from "@/models/userModel";
// import { sendReviewDoneClientEmail, sendReviewDoneConsultantEmail } from "@/mail/reviewDoneMail";
// import { mailSender } from "@/utils/mailSender";
// const sendReviewDoneEmail = async (role,email,reviewDetails)=>{
//   try {
//     const {clientName, consultantName, bookingId, rating, review} = reviewDetails;
//     let emailBody;
//     if(role === "Client"){
//       emailBody = sendReviewDoneClientEmail(clientName, consultantName, bookingId, rating, review);
//     }else if(role === "Consultant"){
//       emailBody = sendReviewDoneConsultantEmail(clientName, consultantName, bookingId, rating, review);
//     }

//     const mailResponse = await mailSender(
//       "New Review Received - TrustConsult",
//       email,
//       emailBody
//     )
//     console.log("Mail response: ",mailResponse)
//   } catch (error) {
//     console.error("Error sending review email:", error);
//   }
// }
// export async function POST(req) {
//   try {
//     await databaseConnection();
//     const { bookingId, rating, review } = await req.json();
//     if (!bookingId || !rating) {
//       return NextResponse.json({ error: "bookingId and rating required" }, { status: 400 });
//     }

//     const booking = await Booking.findById(bookingId);
//     if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

//     const newReview = await Review.create({ bookingId, rating, review: review || "" });
//     booking.rating = rating;
//     booking.review = newReview._id;
//     booking.reviewStatus = true;
//     await booking.save();

//     const Client = await User.findById(booking.clientId);
//     const Consultant = await User.findById(booking.consultantId);

//     sendReviewDoneEmail("Client",Client.email,{
//       clientName: Client.firstName + " " + Client.lastName,
//       consultantName: Consultant.firstName + " " + Consultant.lastName,
//       bookingId: booking._id,
//       rating, review
//     })
//     sendReviewDoneEmail("Consultant",Consultant.email,{
//       clientName: Client.firstName + " " + Client.lastName,
//       consultantName: Consultant.firstName + " " + Consultant.lastName,
//       bookingId: booking._id,
//       rating, review
//     })

//     return NextResponse.json({ success: true, review: newReview });
//   } catch (e) {
//     console.error("Create review error:", e);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import databaseConnection from "@/lib/dbConfig";
import Booking from "@/models/bookingModel";
import Review from "@/models/reviewModel";
import User from "@/models/userModel";
import Consultant from "@/models/consultantModel";
import { sendReviewDoneClientEmail, sendReviewDoneConsultantEmail } from "@/mail/reviewDoneMail";
import { mailSender } from "@/utils/mailSender";


const sendReviewDoneEmail = async (role, email, reviewDetails) => {
  try {
    const { clientName, consultantName, bookingId, rating, review } = reviewDetails;

    const emailBody =
      role === "Client"
        ? sendReviewDoneClientEmail(clientName, consultantName, bookingId, rating, review)
        : sendReviewDoneConsultantEmail(clientName, consultantName, bookingId, rating, review);

    await mailSender(
      "New Review Received - TrustConsult",
      email,
      emailBody
    );
  } catch (error) {
    console.error("Error sending review email:", error);
  }
};


export async function POST(req) {
  try {
    await databaseConnection();

    const { bookingId, rating, review } = await req.json();

    if (!bookingId || !rating) {
      return NextResponse.json(
        { error: "bookingId and rating required" },
        { status: 400 }
      );
    }

    // 1️⃣ Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // 2️⃣ Create the review document
    const newReview = await Review.create({
      bookingId,
      rating,
      review: review || ""
    });

    // 3️⃣ Update booking with new rating
    booking.rating = rating;
    booking.review = newReview._id;
    booking.reviewStatus = true;
    await booking.save();

    // 4️⃣ ✨ Recompute consultant's overall rating
    const consultantId = booking.consultantId;

    const agg = await Booking.aggregate([
      {
        $match: {
          consultantId: consultantId,
          reviewStatus: true
        }
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" }
        }
      }
    ]);

    const avgRating = agg[0]?.avgRating || 0;

    // 5️⃣ Update consultant rating
    await Consultant.findOneAndUpdate(
      { consultantId: consultantId },
      { rating: avgRating.toFixed(1) }
    );

    // 6️⃣ Fetch users for email
    const Client = await User.findById(booking.clientId);
    const ConsultantUser = await User.findById(booking.consultantId);

    // 7️⃣ Send emails
    sendReviewDoneEmail("Client", Client.email, {
      clientName: Client.firstName + " " + Client.lastName,
      consultantName: ConsultantUser.firstName + " " + ConsultantUser.lastName,
      bookingId: booking._id,
      rating,
      review
    });

    sendReviewDoneEmail("Consultant", ConsultantUser.email, {
      clientName: Client.firstName + " " + Client.lastName,
      consultantName: ConsultantUser.firstName + " " + ConsultantUser.lastName,
      bookingId: booking._id,
      rating,
      review
    });

    // 8️⃣ Response
    return NextResponse.json({ success: true, review: newReview });

  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

