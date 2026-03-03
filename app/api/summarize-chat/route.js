import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseConfig"; // Using the initialized client-side config
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

export async function POST(request) {
  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    // Path to the messages subcollection in Firestore
    const messagesRef = collection(db, `chats/${bookingId}/messages`);
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ summary: "No chat messages were found for this booking." });
    }

    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push(doc.data());
    });

    const chatHistory = messages
      .map((msg) => `**${msg.senderName || 'User'}**: ${msg.text}`)
      .join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Summarize the following conversation between a client and a consultant. Identify the key questions, advice given, and any agreed-upon next steps. The summary should be concise and easy to read.\n\n**Conversation:**\n${chatHistory}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return NextResponse.json({ summary });

  } catch (error) {
    console.error("Error during chat summarization:", error);
    const errorMessage = error.message || "An unexpected error occurred while summarizing the chat.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
