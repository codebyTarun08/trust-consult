/*
import databaseConnection from "@/lib/dbConfig";
import Message from "@/models/messageModel";

export default async function handler(req, res) {
  await connectDB();
  const { room } = req.query;

  if (req.method === "GET") {
    try {
      const messages = await Message.find({ bookingId: room }).sort({ createdAt: 1 });
      return res.status(200).json(messages);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch messages" });
    }
  }

  if (req.method === "POST") {
    try {
      const newMsg = await Message.create(req.body);
      return res.status(201).json(newMsg);
    } catch (err) {
      return res.status(500).json({ error: "Failed to save message" });
    }
  }

  return res.status(405).end();
}
*/

import { NextResponse } from "next/server";
import databaseConnection from "@/lib/dbConfig";
import Message from "@/models/messageModel";
import Booking from "@/models/bookingModel"
import User from "@/models/userModel"
export async function GET(req) {
  databaseConnection();
  try {

    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId"); 
    
    if (!roomId) {
      return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
    }

    const messages = await Message.find({bookingId : roomId})
      .sort({ createdAt: 1 })
      .populate("senderId", "firstName lastName image");

    if(messages.length === 0 ){
      return NextResponse.json(
        {
        message:"No messages found for this room",
        messages
        }
        ,
        {status:200}
     )
    }
    return NextResponse.json(messages, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch messages:", err);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// export async function POST(req) {
//   try {
//     databaseConnection();
//     const body = await req.json();
    
//     const { bookingId, senderId, type = "text", content, image } = body;
    
//     if (!bookingId || !senderId || !content) {
//       return NextResponse.json(
//         { error: "bookingId, senderId, and content are required" },
//         { status: 400 }
//       );
//     }

//     // If image is provided, set type to image
//     const messageType = image ? "image" : type;
//     const messageContent = image || content;

//     const newMsg = await Message.create({
//       bookingId,
//       senderId,
//       type: messageType,
//       content: messageContent,
//     });

//     const populatedMsg = await Message.findById(newMsg._id)
//       .populate("senderId", "firstName lastName image");

//     return NextResponse.json(populatedMsg, { status: 201 });
//   } catch (err) {
//     console.error("Failed to save message:", err);
//     return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
//   }
// }


export async function POST(req) {
  try {
    await databaseConnection();
    const body = await req.json();

    const { bookingId, senderId, text, imageUrl } = body;

    if (!bookingId || !senderId || (!text && !imageUrl)) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    let type = "text";
    if (imageUrl && !text) type = "image";
    if (imageUrl && text) type = "mixed";

    const newMsg = await Message.create({
      bookingId,
      senderId,
      text: text || "",
      imageUrl: imageUrl || null,
      type,
    });

    const populated = await Message.findById(newMsg._id)
      .populate("senderId", "firstName lastName image");

    return NextResponse.json(populated, { status: 201 });
  } catch (error) {
    console.error("Failed to save message:", error);
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}
