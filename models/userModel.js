import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    image:{
        type:String,
        trim:true
    },
    phoneNumber:{
        type:String,
        trim:true
    },
    role:{
        type: String,
        required:true,
        enum:["Client","Consultant","Admin"]
    }
  },
  { 
    timestamps: true 
  }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
