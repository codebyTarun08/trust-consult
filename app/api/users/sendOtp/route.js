import Otp from "@/models/otpModel";
import User from "@/models/userModel";
import databseConnection from "@/lib/dbConfig";
import { NextResponse } from "next/server";
import otpGenerator from "otp-generator";
import { sendOtpVerificationEmail } from "@/models/otpModel";
export async function POST(request) {
  try {
    await databseConnection();

    const { email } = await request.json();

    // Check if user already exists
    const existUser = await User.findOne({ email });
    if (existUser) {
      return NextResponse.json(
        { error: "User Already Exists" },
        { status: 401 }
      );
    }

    // Generate numeric-only OTP
        let otp = otpGenerator.generate(6, { alphabets:false, upperCase: false, specialChars: false})

    // Ensure uniqueness in DB (optional but safer)
    let existingOtp = await Otp.findOne({ otp });
    while (existingOtp) {
      let otp = otpGenerator.generate(6, { alphabets:false, upperCase: false, specialChars: false})
      existingOtp = await Otp.findOne({ otp });
    }

    // Save OTP with expiry (e.g., 5 min)
    const otpBody = await Otp.create({
      otp,
      email,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    await sendOtpVerificationEmail(email, otp);

   // console.log("OTP Created:", otpBody);

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
