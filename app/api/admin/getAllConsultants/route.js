import User from '@/models/userModel'
import databseConnection from '@/lib/dbConfig'
import { NextResponse } from 'next/server'

export async function GET(){
    try {
        const consultants = await User.find({ role: "Consultant" });
        return NextResponse.json(
            {
                message:"All Consultants fetched Successfully",
                consultants
            },
            {status:200}
        )
    } catch (error) {
        console.log("error in getting consultants:", error)
        return NextResponse.json(
            {
                message: "Error in getting consultants",
                error: error.message
            },
            { status: 500 }
        )
    }
}