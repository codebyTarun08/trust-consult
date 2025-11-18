// app/api/consultant/getBookings/route.js
import { NextResponse } from "next/server";
import databaseConnection from "@/lib/dbConfig";
import Booking from "@/models/bookingModel";

export async function GET(req) {
  try {
    await databaseConnection();

    const consultantId = req.headers.get("x-user-id");
    if (!consultantId)
      return NextResponse.json({ error: "Consultant ID missing" }, { status: 400 });

    const bookings = await Booking.find({ consultantId })
      .populate("clientId", "firstName lastName email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: bookings }, { status: 200 });
  } catch (error) {
    console.error("Error fetching consultant bookings:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
