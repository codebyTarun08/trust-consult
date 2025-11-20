import {
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";

import { db } from "./firebaseconfig";

// SEND MESSAGE ---------------------
export async function sendMessage(roomId, message) {
  return await addDoc(collection(db, "chats", roomId, "messages"), {
    senderId: message.senderId,
    senderName: message.senderName,
    text: message.text || "",
    imageUrl: message.imageUrl || null,
    type: message.type || "text",
    createdAt: serverTimestamp(),
  });
}

// LISTEN TO MESSAGES -----------------
export function listenToMessages(roomId, callback) {
  const q = query(
    collection(db, "chats", roomId, "messages"),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });
}
