// /api/consultant/create-profile/route.js
import databaseConnection from "@/lib/dbConfig";
import Consultant from "@/models/consultantModel";
import Availability from "@/models/availabilityModel";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    await databaseConnection();

    const { consultantId, bio, expertise, categories, timeSlots } = await request.json();

    if (!consultantId || !bio || !expertise || !categories || !timeSlots) {
      return NextResponse.json(
        { success: false, message: "ALL Fields are Required" },
        { status: 400 }
      );
    }

    // 1. Upsert Availability (create or update same availability)
    const availability = await Availability.findOneAndUpdate(
      { consultant: consultantId },
      { $set: { consultant: consultantId, timeSlots } },
      { upsert: true, new: true }
    );

    // 2. Upsert Consultant (create or update same consultant)
    const consultant = await Consultant.findOneAndUpdate(
      { consultantId },
      {
        $set: {
          bio,
          expertise,
          categories,
          availability: availability._id,
        },
      },
      { upsert: true, new: true }
    )
      .populate("availability")
      .populate("categories");

    return NextResponse.json(
      { success: true, consultant, message: "Consultant profile saved successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error in create-profile API:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
