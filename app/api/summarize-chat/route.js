import { NextResponse } from "next/server";
import Message from "@/models/messageModel";
import databaseConnection from "@/lib/dbConfig";





export async function POST(request) {
  try {
    await databaseConnection();
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    // In this project, the booking ID is used as the chat room ID.
    const messages = await Message.find({ roomId: bookingId }).sort({ timestamp: "asc" });

    if (messages.length === 0) {
      return NextResponse.json({ summary: "No chat messages were found for this booking." });
    }

    // Combine messages into a single string for the AI to process.
    const chatHistory = messages
      .map((msg) => `${msg.senderId === bookingId.consultantId ? "Consultant" : "Client"}: ${msg.text}`)
      .join("\n");

    // --- AI Summarization Placeholder ---
    // The following section is where you would integrate a real AI model
    // to generate a summary of the chat history.
    /*
    const summary = await ai.summarize(chatHistory, {
      prompt: "Summarize the key points and outcomes of this client-consultant conversation."
    });
    */
    
    // As a placeholder, we'll return a snippet of the chat.
    const placeholderSummary = `This is a placeholder summary. To enable AI summarization, integrate an AI service in app/api/summarize-chat/route.js. The chat has ${messages.length} messages. Here's a snippet: "${messages[0].text}"`;

    return NextResponse.json({ summary: placeholderSummary });

  } catch (error) {
    console.error("Error during chat summarization:", error);
    return NextResponse.json({ error: "An unexpected error occurred while summarizing the chat." }, { status: 500 });
  }
}
