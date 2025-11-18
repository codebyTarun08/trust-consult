import { NextResponse } from "next/server";
import databaseConnection from "@/lib/dbConfig";
import Booking from "@/models/bookingModel";
import Review from "@/models/reviewModel";
import User from "@/models/userModel";
export async function GET(req) {
  try {
    await databaseConnection();
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");
    if (!bookingId) return NextResponse.json({ error: "bookingId required" }, { status: 400 });
    const booking = await Booking.findById(bookingId).populate(["clientId", "consultantId", "review"]);
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    return NextResponse.json({ success: true, booking });
  } catch (e) {
    console.error("Get booking error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


