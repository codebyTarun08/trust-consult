import mongoose from "mongoose";
import User from "@/models/userModel"
import { NextResponse } from "next/server";
import databseConnection from "@/lib/dbConfig";
import bcrypt from 'bcrypt';
databseConnection();
export async function POST(request){
    try {
       const {email,oldPassword,newPassword,cnfNewPassword}= await request.json();
       if(!email || !oldPassword || !newPassword || !cnfNewPassword){
        return NextResponse.json(
            {error:"All fields are required"},
            {status:400}
        );
       }
       else if(newPassword !== cnfNewPassword){
        return NextResponse.json(
            {error:"Passwords do not match"},
            {status:400}
        );
       }
       const user = await User.findOne({email});
       if(!user){
        return NextResponse.json(
            {error:"User does not exists"},
            {status:404}
        );
       }
       if(!await bcrypt.compare(oldPassword,user.password)){
        return NextResponse.json(
            {error:"Old password is incorrect"},
            {status:400}
        );
       }
       user.password = await bcrypt.hash(newPassword,10);
       await user.save();
       const result=NextResponse.json(
           {
            message:"Password reset successfulldddy",
            user
           },
           {status:200}
       );
       return result;
    } catch (error) {
        console.log("Reset Password Api error",error);
        return NextResponse.json(
            {error:"Internal Server Error"},
            {status:500}
        );
    }
}