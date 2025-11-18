import databaseConnection from '@/lib/dbConfig'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server";
import User from '@/models/userModel'

databaseConnection();
export async function POST(request){
    try {
        const {email,password} = await request.json();
        // console.log("Email",email)
        // console.log("Password ",password)
        if(!email || !password){
            return NextResponse.json(
                {error:"All Input Fields are Required"},
                {status:400}
            )
        }

        let user = await User.findOne({email});
        if(!user){
            return NextResponse.json(
                {error:"User Does Not Exist"},
                {status:401}
            )
        }
        //console.log("USER ",user)

        const payload = {
            email:user?.email,
            id:user?._id,
            role:user?.role
        }

        if(await bcrypt.compare(password,user?.password)){
            let token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"2h"});
            user.password=undefined;

            const options = {
                httpOnly:true,
                secure:false,
                expires : new Date(Date.now() + 2*60*60*1000)
            };
            const response = NextResponse.json(
                {
                    success:true,
                    user,
                    token,
                    message:"User Logged In Successfully"
                },
                {status:200}
            )
            response.cookies.set("token",token,options);
            return response
        }
    } catch (error) {
        console.log("Error in  Login Handler ",error);
        return NextResponse.json(
            {error:"Login Failed , Internal Server Error"},
            {status:500}
        )
    }
}