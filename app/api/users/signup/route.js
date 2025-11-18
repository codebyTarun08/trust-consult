import mongoose from "mongoose"
import databseConnection from "@/lib/dbConfig"
import User from "@/models/userModel"
import {NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import Otp from "@/models/otpModel";

databseConnection();

export async function POST(request){
    try {
        const {firstName,lastName,email,password,confirmPassword,phoneNumber,role,otp} = await request.json();
     //   console.log(firstName,lastName,email,password,confirmPassword,phoneNumber,role,otp)
        if(!firstName || !lastName || !email || !password || !confirmPassword || !phoneNumber || !role || !otp){
           return NextResponse.json({error: "All fields are required"}, {status: 400});
        }

        if(password !== confirmPassword){
           return NextResponse.json({error: "Passwords do not match"}, {status: 400});
        }

        let user = await User.findOne({email});
        if(user){
            return NextResponse.json(
                {error:"User Already exists",},
                {status:401}
            )
        }

        let createdOtp = await Otp.findOne({email}).sort({createdAt:-1}).limit(1);

        if(!createdOtp){
            return NextResponse.json(
                {error: "Please request for a new OTP"}
                , {status: 400}
            );
        }
        if(createdOtp.otp !== otp){
            return NextResponse.json({error: "Invalid OTP"}, {status: 400});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            phoneNumber,
            role,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
        })

     //   console.log("User: ",user);

        return NextResponse.json(
            {
            success: true,
            message: "User SignUp successfully",
            user,
            },
            { status: 200 }
        );

    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {
                success:false,
                message:"Issue in SignUp handler"
            },
            {status:500}
        )
    }
}
