import databseConnection from "@/lib/dbConfig";
import User from "@/models/userModel"
import { NextResponse } from "next/server";

databseConnection();
export async function PUT(request){
    try {
      //  console.log(request.headers)
        const id = request.headers.get('x-user-id')
     //   console.log("ID",id)
        const {firstName,lastName,email,phoneNumber} = await request.json();
        if(!firstName || !lastName || !email || !phoneNumber){
            return NextResponse.json(
                {success:false,error:"All fields are required"},
                {status:404}
            )
        }
        const user = await User.findByIdAndUpdate(
            {_id:id}, {
            firstName,
            lastName,
            email,
            phoneNumber
        }, { new: true });
        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            {error:"Internal Server error"},
            {status:500}
        )
    }
}