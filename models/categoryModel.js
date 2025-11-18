const mongoose=require("mongoose");

const categorySchema=new mongoose.Schema(
    {
       name:{
        type:String,
       },
       description:{
        type:String
       },
       isActive:{
        type:Boolean,
        default:true
       }
    },
    {
        timestamps:true
    }
);

export default mongoose.models.Category || mongoose.model("Category",categorySchema);