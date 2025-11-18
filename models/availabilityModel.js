import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    consultant: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true 
    },
   // date: { type: Date, required: true },
    timeSlots: [
      {
        startHour: { type: Number, required: true },
        endHour: { type: Number, required: true },
        rate: { type: Number, required: true },
        isBooked: { type: Boolean, default: false }
      }
    ]
  },
  { 
    timestamps: true 
  }
);

export default mongoose.models.Availability || mongoose.model("Availability", availabilitySchema);
