import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
    {
    clientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
 },
 {
    timestamps: true
 }
);

export default mongoose.models.Client || mongoose.model("Client", clientSchema);