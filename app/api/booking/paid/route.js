import { NextResponse } from "next/server";
import databaseConnection from "@/lib/dbConfig";
import Booking from "@/models/bookingModel";

export async function PUT(req) {
  try {
    await databaseConnection();
    const { bookingId } = await req.json();
    if (!bookingId) return NextResponse.json({ error: "Booking ID required" }, { status: 400 });

    const booking = await Booking.findById(bookingId);
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    booking.paymentStatus = "paid";
    await booking.save();

    return NextResponse.json({ success: true, booking });
  } catch (e) {
    console.error("Mark paid error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


