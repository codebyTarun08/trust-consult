import mongoose from "mongoose";
import { otpVerificationTemplate } from "@/mail/otpVerificationTemplate";
import { mailSender } from "@/utils/mailSender";

const otpSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            trim:true
        },
        otp:{
            type:String,
            required:true,
            trim:true
        },
        createdAt:{
            type:Date,
            default:Date.now,
            expires:300 // OTP expires in 5 minutes
        }
    }
);

export default mongoose.models.Otp || mongoose.model("Otp", otpSchema);

const sendOtpVerificationEmail = async (email, otp) => {
    // Implement email sending logic here using nodemailer or any email service
    try {
    const emailBody = otpVerificationTemplate(otp);
    const mailResponse =await mailSender(
        "OTP Verification Mail - TrustConsult",
        email,
        emailBody
    );
    //console.log("Mail Response: ", mailResponse);
    } catch (error) {
        console.error("Error sending OTP email:", error);
    }
}

export { sendOtpVerificationEmail };