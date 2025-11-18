import databaseConnection from "@/lib/dbConfig";
import { NextResponse } from "next/server";
import Booking from "@/models/bookingModel";
import Review from "@/models/reviewModel";
export async function GET(request) {
  try {
    await databaseConnection();

    const { searchParams } = new URL(request.url);
    const consultantId = searchParams.get("consultantId");

    if (!consultantId) {
      return NextResponse.json(
        { success: false, message: "Missing consultantId" },
        { status: 400 }
      );
    }

    const bookings = await Booking.find({ consultantId:consultantId , reviewStatus:true}).populate('review');

    return NextResponse.json(
      { success: true, bookings },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching bookings" },
      { status: 500 }
    );
  }
}
