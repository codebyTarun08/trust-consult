import User from '@/models/userModel'
import Consultant from '@/models/consultantModel'
import databaseConnection from '@/lib/dbConfig'
import { NextResponse } from 'next/server'
import Availability from '@/models/availabilityModel'
import Category from '@/models/categoryModel'

export async function GET() {
  try {
    await databaseConnection();

    // Fetch and populate related fields
    const consultants = await Consultant.find()
      .populate("consultantId")
      .populate({ path: "categories", select: "name" })
      .populate("availability");

    // Filter only those consultants having all required fields
    const filteredConsultants = consultants.filter(c => {
      return (
        c.consultantId &&
        c.categories && c.categories.length > 0 && 
        c.availability && c.availability.timeSlots?.length > 0 && 
        c.bio && c.expertise?.length > 0
      );
    });

    return NextResponse.json(
      {
        success: true,
        message: "Filtered consultants fetched successfully",
        consultants: filteredConsultants
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in getting consultants:", error);
    return NextResponse.json(
      {
        message: "Error in getting consultants",
        error: error.message
      },
      { status: 500 }
    );
  }
}
