import databaseConnection from "@/lib/dbConfig";
import User from "@/models/userModel";
import Availability from "@/models/availabilityModel";
import { NextResponse } from "next/server";
import Consultant from "@/models/consultantModel";
import Booking from "@/models/bookingModel";

export async function GET(request){
    try {
        const {searchParams} = new URL(request.url)
        const id = searchParams.get("id");
       // console.log(id);
        if(!id){
            return NextResponse.json({message:"Id not found"},{status:400});
        }
        const consultantData = await Consultant.findById({_id:id})
        .populate("consultantId")
        .populate("availability")
        .populate({path:"categories",select:"name"})
       // const previousBookings = await Booking.find({consultant:id})
       const previousBookings = await Booking.find({consultantId:id})
       .populate("clientId","firstName lastName email image")
       .populate("consultantId","firstName lastName email image");
       consultantData.previousBookings = previousBookings;
        return NextResponse.json(
            {
             success:true,
             message:"Consultant Data Fetched Successfully",
             consultantData,
            },
            {status:200}
        )
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            {
                error:"Internal Server Error"
            },
            {status:500}
        )
    }
}