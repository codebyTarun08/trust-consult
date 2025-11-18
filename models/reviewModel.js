import mongoose from "mongoose";
import Consultant from "./consultantModel"
const reviewSchema  = new mongoose.Schema(
    {
        bookingId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Booking",
            required:true
        },
        rating:{
            type:Number,
            required:true,
            min:1,
            max:5
        },
        review:{
            type:String,
            trim:true
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);
