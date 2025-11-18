import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        clientId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        consultantId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        description:{
            type:String,
            trim:true,
            required:true
        },
        slot:{
            startHour:{type:Number,required:true},
            endHour:{type:Number,required:true},
            date:{type:Date,required:true},
            bookingAmount:{ type:Number,required:true},
        },
        status: {
            type: String,
            enum: ["pending", "completed", "cancelled", "accepted", "confirmed"],
            default: "pending",
        },
        paymentStatus:{
            type: String,
            enum: ["unpaid", "paid"],
            default: "unpaid",
        },
        rating:{
            type:Number,
            default:0,
        },
        review:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        },
        reviewStatus:{
            type:Boolean,
            default:false
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema); 