import mongoose from "mongoose";

const consultantSchema = new mongoose.Schema(
    {
        consultantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        bio:{
            type: String,
            trim:true
        },
        expertise:[
            {
                type:String,
                trim:true
            }
        ],
        rating:{
            type:Number,
            default:0
        },
        availability:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Availability",
            required:true
        },
        categories:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Category"
            }
        ]   
    },
    {
        timestamps: true
    }
);

export default mongoose.models.Consultant || mongoose.model("Consultant", consultantSchema);
