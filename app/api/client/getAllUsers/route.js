import User from '@/models/userModel'
import databseConnection from '@/lib/dbConfig'
import { NextResponse } from 'next/server'

export async function GET(){
    try {
        databseConnection()
        const users = await User.find({role:"Consultant"});
        return NextResponse.json(
            {
                success:true,
                message:"All Consultants fetched Successfully",
                users
            },
            {status:200}
        )
    } catch (error) {
        console.log("error in getting users:", error)
        return NextResponse.json(
            {
                message: "Error in getting users",
                error: error.message
            },
            { status: 500 }
        )
    }
}