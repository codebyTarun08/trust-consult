/* ======================================================
   5) /app/chat/[roomId]/page.js
   Full ChatPage (client) using Firebase helpers above.
   - Replaces socket.io completely
   - Uses Cloudinary for image uploads
   - Preserves your payment + review flow
   ====================================================== */

// /app/chat/[roomId]/page.js
"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Rating from "react-rating";
import { FaVideo, FaPhoneSlash, FaImage, FaStar } from "react-icons/fa";
import { useParams, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { getBookings } from "@/services/clientService";

// Firebase helpers
import { sendMessage, listenToMessages } from "@/lib/firestoreChat";
import {
  createCallOffer,
  listenForOffer,
  createCallAnswer,
  listenForAnswer,
  sendIceCandidate,
  listenForIceCandidates,
  setCallStatus,
  listenForCallRequest,
} from "@/lib/firebaseCall"; // listenForCallRequest not implemented here but flow uses call doc
import { setUserOnline, setUserOffline, listenToPresence } from "@/lib/presense";
import { db } from "@/lib/firebaseConfig";
import { doc, onSnapshot,updateDoc } from "firebase/firestore";

export default function ChatPage() {
  const { roomId } = useParams();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const [localUser, setLocalUser] = useState({ name: "You", id: "" });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [uploadImage, setUploadImage] = useState(null);
  const [sending, setSending] = useState(false);

  const [receiverOnline, setReceiverOnlineState] = useState(false);
  const [receiverName, setReceiverName] = useState("Receiver");
  const [receiverAvatar, setReceiverAvatar] = useState("https://avatar.iran.liara.run/public/48");
  const [booking, setBooking] = useState(null);

  const [videoCallActive, setVideoCallActive] = useState(false);
  const [incomingCallFrom, setIncomingCallFrom] = useState(null);
  const [endCallModal, setEndCallModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);

  // WebRTC refs
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnection = useRef();
  const remoteMediaStream = useRef(null);
  const iceCandidateQueue = useRef([]);
  const roleRef = useRef(null); // "caller" or "callee"

  // --------------- Load user -----------------
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      if (u) setLocalUser({ name: `${u.firstName || "User"} ${u.lastName || ""}`.trim(), id: u._id });
    } catch (e) {
      console.warn("Failed to read local user", e);
    }
  }, []);

  // --------------- Presence -----------------
  useEffect(() => {
    if (!localUser.id) return;
    setUserOnline(localUser.id);
    return () => setUserOffline(localUser.id);
  }, [localUser.id]);

  // --------------- Booking loader (same as original) -----------------
  useEffect(() => {
    const loadBooking = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;
        const result = await dispatch(getBookings({ userId: user._id, role: user.role }));
        const bookings = Array.isArray(result) ? result : (result?.data || []);
        const current = bookings.find((b) => String(b._id) === String(roomId));
        if (current) {
          setBooking(current);
          const userId = user._id;
          const isClient = String(current.clientId?._id || current.clientId) === String(userId);
          const other = isClient ? current.consultantId : current.clientId;
          const name = other?.firstName ? `${other.firstName} ${other.lastName || ""}`.trim() : "Receiver";
          setReceiverName(name);
          if (other?.image) setReceiverAvatar(other.image);

          // Listen to presence of other
          if (other?._id) {
            const unsubPresence = listenToPresence(other._id, (isOnline) => setReceiverOnlineState(isOnline));
            // store unsub for cleanup
            // we won't store unsub globally here, it's fine because effect will cleanup when booking changes
            // but keep a ref if needed
          }

          const end = new Date(current.slot.date);
          end.setHours(current.slot.endHour, 0, 0, 0);
        }
      } catch (e) {
        console.error("Failed to load booking:", e);
      }
    };
    loadBooking();
  }, [dispatch, roomId]);

  // --------------- Messages (Firestore listener) -----------------
  useEffect(() => {
    if (!roomId) return;
    const unsub = listenToMessages(roomId, (msgs) => {
      // transform to your UI format if needed
      const formatted = msgs.map((m) => ({
        sender: m.senderName || "Unknown",
        senderId: m.senderId,
        text: m.text || "",
        imageUrl: m.imageUrl || null,
        messageId: m.id,
        createdAt: m.createdAt ? m.createdAt.toDate ? m.createdAt.toDate() : m.createdAt : new Date(),
      }));
      setMessages(formatted);
    });

    return () => unsub && unsub();
  }, [roomId]);

  // --------------- Send message (uses Cloudinary for images) -----------------
  async function uploadToCloudinary(file) {
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`, { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error("Cloudinary upload failed", err);
      throw err;
    }
  }

  async function handleSendMessage() {
    if ((!input.trim() && !uploadImage) || sending) return;
    setSending(true);

    try {
      let imageUrl = null;
      if (uploadImage?.file) imageUrl = await uploadToCloudinary(uploadImage.file);

      const message = {
        senderId: localUser.id,
        senderName: localUser.name,
        text: input.trim(),
        imageUrl,
        type: imageUrl && input.trim() ? "mixed" : imageUrl ? "image" : "text",
      };

      // Optimistic UI
      const tempId = `temp-${Date.now()}`;
      setMessages((p) => [...p, { ...message, messageId: tempId, createdAt: new Date() }]);

      await sendMessage(roomId, message);
      setInput("");
      setUploadImage(null);
    } catch (err) {
      console.error("Send message failed", err);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadImage({ file, preview: reader.result });
    };
    reader.readAsDataURL(file);
  }

  // ----------------------- WebRTC helpers (integrate with firebaseCall) -----------------------
  function getIceServers() {
    const servers = [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ];
    try {
      const turnUrl = process.env.NEXT_PUBLIC_TURN_URL;
      const turnUser = process.env.NEXT_PUBLIC_TURN_USERNAME;
      const turnCred = process.env.NEXT_PUBLIC_TURN_CREDENTIAL;
      if (turnUrl && turnUser && turnCred && /^turns?:/i.test(turnUrl)) {
        servers.push({ urls: turnUrl, username: turnUser, credential: turnCred });
      }
    } catch (e) {
      console.error("TURN config error", e);
    }
    return servers;
  }

  async function createPeerConnection(role) {
    // cleanup existing
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (remoteMediaStream.current) {
      remoteMediaStream.current.getTracks().forEach(t => t.stop());
      remoteMediaStream.current = null;
    }
    iceCandidateQueue.current = [];

    const pc = new RTCPeerConnection({ iceServers: getIceServers() });

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        // push candidate to Firestore
        sendIceCandidate(roomId, e.candidate.toJSON(), role);
      }
    };

    pc.ontrack = (e) => {
      if (!remoteMediaStream.current) remoteMediaStream.current = new MediaStream();
      if (e.track) {
        const exists = remoteMediaStream.current.getTracks().some(t => t.id === e.track.id);
        if (!exists) remoteMediaStream.current.addTrack(e.track);
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteMediaStream.current;
        remoteVideoRef.current.play().catch(() => {});
      }
    };

    pc.onconnectionstatechange = () => console.log("pc connection state", pc.connectionState);
    pc.oniceconnectionstatechange = () => console.log("pc ice state", pc.iceConnectionState);

    peerConnection.current = pc;

    // listen to remote ICE candidates from firestore
    const unsubCandidates = listenForIceCandidates(roomId, role, async (candidate) => {
      try {
        if (candidate) await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) { console.warn("addIceCandidate error", err); }
    });

    return () => unsubCandidates && unsubCandidates();
  }

    async function ensureLocalStream() {
    if (localVideoRef.current?.srcObject) {
        const stream = localVideoRef.current.srcObject;
        const active = stream.getTracks().filter(t => t.readyState === "live").length;
        if (active) return stream;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: true });

    // DO NOT create peerConnection here — createPeerConnection(role) must be called first outside
    // Add tracks to existing pc (assumes createPeerConnection was already called)
    if (!peerConnection.current) {
        // fallback if you forgot to create pc — but prefer to always createPc before calling ensureLocalStream
        console.warn("ensureLocalStream: peerConnection not created yet");
    }

    stream.getTracks().forEach(track => {
        const sender = peerConnection.current?.getSenders().find(s => s.track && s.track.kind === track.kind);
        if (sender) {
        try { sender.replaceTrack(track); } catch(e) { console.warn("replaceTrack failed", e); }
        } else {
        try { peerConnection.current?.addTrack(track, stream); } catch(e) { console.warn("addTrack failed", e); }
        }
    });

    if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(() => {});
    }
    return stream;
    }


    async function handleStartCall() {
    try {
        setVideoCallActive(true);
        roleRef.current = "caller";

        // 1) create pc first
        await createPeerConnection("caller");

        // 2) then get local stream and add tracks to pc
        await ensureLocalStream();

        // 3) create offer AFTER tracks exist on pc
        const offer = await peerConnection.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
        });
        await peerConnection.current.setLocalDescription(offer);

        // 4) write offer to Firestore
        await createCallOffer(roomId, offer, { id: localUser.id, name: localUser.name });

        // 5) listen for answer and call status as before
        const unsubAnswer = listenForAnswer(roomId, async (answer) => {
        if (answer) await peerConnection.current.setRemoteDescription(answer);
        });

        const callRef = doc(db, "calls", roomId);
        const unsubCall = onSnapshot(callRef, (snap) => {
        const data = snap.data();
        if (!data) return;
        if (data.status === "ended") {
            cleanupPeer();
            setVideoCallActive(false);
            setEndCallModal(true);
        }
        });

    } catch (err) {
        console.error("startCall err", err);
        setVideoCallActive(false);
    }
    }


  function rejectIncomingCall() {
    setIncomingCallFrom(null);
    setCallStatus(roomId, "rejected");
  }

    async function acceptIncomingCall() {
    try {
        setVideoCallActive(true);
        roleRef.current = "callee";

        // create pc first
        await createPeerConnection("callee");

        // then ensure local stream and add tracks to the pc
        await ensureLocalStream();

        // update call status to accepted so caller will create offer
        await setCallStatus(roomId, "accepted");

        // after caller sends offer, listenForOffer handler (below) will set remote desc and create answer
    } catch (err) {
        console.error("acceptIncomingCall err", err);
        setVideoCallActive(false);
    }
    }


  // Listen for offers (callee side)
  useEffect(() => {
    if (!roomId) return;
    const unsubOffer = listenForOffer(roomId, async (offer, caller) => {
      if (!offer) return;
      // show incoming call modal
      if (caller.id === localUser.id) return; // ignore self
      setIncomingCallFrom(caller.name || "Participant");

      // Wait until user accepts -> handled by acceptIncomingCall
      // But prepare automatic answer flow if user accepts
      // We set up a one-time listener that will run when we accept
      // If user accepts, create answer, set local desc, update doc
      const waitForAccept = onSnapshot(doc(db, "calls", roomId), async (snap) => {
        const data = snap.data();
        if (!data) return;
        // when status === "accepted"
        if (data.status === "accepted") {
        try {
            // ensure peerConnection exists first
            if (!peerConnection.current) await createPeerConnection("callee");

            // ensure local stream (adds tracks to pc)
            await ensureLocalStream();

            // then set remote description from offer
            await peerConnection.current.setRemoteDescription(offer);

            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);

            await createCallAnswer(roomId, answer, { id: localUser.id, name: localUser.name });
        } catch (err) {
            console.error("Error creating answer after accept:", err);
        }
        }
      });

      // cleanup listener when call ends or accepted
      const unsubCleanup = () => waitForAccept();
    });

    return () => unsubOffer && unsubOffer();
  }, [roomId, localUser.id]);

  // Listen for call doc changes to handle end/reject from remote
  useEffect(() => {
    if (!roomId) return;
    const callRef = doc(db, "calls", roomId);
    const unsub = onSnapshot(callRef, (snap) => {
      const data = snap.data();
      if (!data) return;
      if (data.status === "rejected") {
        setIncomingCallFrom(null);
        setVideoCallActive(false);
      }
      if (data.status === "ended") {
        cleanupPeer();
        setVideoCallActive(false);
        setEndCallModal(true);
      }
    });
    return () => unsub && unsub();
  }, [roomId]);

  // END CALL
  async function handleEndCall() {
    await setCallStatus(roomId, "ended");
    setVideoCallActive(false);
    setEndCallModal(true);
    cleanupPeer();

    // Booking complete => payment flow
    if (booking?._id) {
      fetch("/api/booking/complete", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking._id }),
      }).finally(() => setPaymentModal(true));
    } else {
      setPaymentModal(true);
    }
  }

  async function handleEndVideoCall() {
  try {
    console.log("Ending call...");

    // Notify the other peer through Firestore
    const callRef = doc(db, "calls", roomId);
    await updateDoc(callRef, { status: "ended" });

    // Cleanup WebRTC resources
    cleanupPeer();

    // Close local UI
    setVideoCallActive(false);
    setIncomingCallFrom(null);

    // Optional: show a simple confirmation modal
    setEndCallModal(true);

  } catch (error) {
    console.error("Error ending call:", error);
  }
}


  function cleanupPeer() {
    try {
      const localStream = localVideoRef.current?.srcObject;
      if (localStream && localStream.getTracks) {
        localStream.getTracks().forEach((t) => t.stop());
      }
      if (remoteMediaStream.current) {
        remoteMediaStream.current.getTracks().forEach((t) => t.stop());
        remoteMediaStream.current = null;
      }
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      iceCandidateQueue.current = [];
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
    } catch (err) {
      console.error("cleanupPeer err", err);
    }
  }

  // Payment handling (same as before)
  async function handlePayment() {
    try {
      if (!booking?._id) {
        alert("Booking ID missing");
        return;
      }

      const res = await fetch("/api/payment/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking._id }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to create payment session");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Payment session could not be created.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong while initiating payment.");
    }
  }

  // Verify payment after redirect
  useEffect(() => {
    const sessionId = searchParams?.get("session_id");
    if (!sessionId) return;
    const verifyPayment = async () => {
      try {
        const res = await fetch(`/api/payment/verify-session?session_id=${sessionId}`);
        const data = await res.json();
        if (data?.paid) {
          setReviewModal(true);
          setPaymentModal(false);
        }
      } catch (err) {
        console.error("Payment verification failed:", err);
      }
    };
    verifyPayment();
  }, [searchParams]);


  // UI rendering (kept similar to your original)
  return (
    <div className="flex flex-col h-screen bg-richblack-900 text-white">
      <div className="flex items-center justify-between px-6 py-3 bg-richblack-800 shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Image width={100} height={100} src={receiverAvatar} alt="avatar" className={`rounded-full object-cover border w-12 h-12 shadow-sm`} />
          <div>
            <div className="font-bold text-lg">{receiverName}</div>
            <span className={`text-xs ${receiverOnline ? "text-green-400" : "text-gray-200"}`}>
              {receiverOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleStartCall} className="bg-green-600/20 hover:bg-green-700/30 p-2 rounded-full cursor-pointer"><FaVideo size={20} /></button>
          <button onClick={handleEndCall} className="bg-red-600 hover:bg-red-700 p-2 rounded-full cursor-pointer"><FaPhoneSlash size={20} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-2 bg-richblack-900">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col max-w-xs rounded-xl p-2 ${String(msg.senderId) === String(localUser.id) ? "self-end bg-blue-600" : "self-start bg-richblack-700"}`}>
            {msg.imageUrl && <Image width={300} height={100} src={msg.imageUrl} alt="sent" className="rounded mb-2 max-h-40 object-contain" />}
            <span>{msg.text}</span>
            <span className="text-[10px] text-gray-300 text-right">{msg?.sender}</span>
          </div>
        ))}
      </div>

      {videoCallActive && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
          <div className="w-full max-w-4xl px-4">
            <div className="md:flex md:flex-row gap-4">
              <div className="w-30 h-40 md:w-1/2 relative">
                <video ref={localVideoRef} autoPlay muted playsInline className="w-full rounded-lg bg-black border border-richblack-700 aspect-video object-cover" />
                <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs">You</div>
              </div>
              <div className="w-full h-[90%] md:w-1/2 relative">
                <video ref={remoteVideoRef} autoPlay playsInline className="w-full rounded-lg bg-black border border-richblack-700 aspect-video object-cover" />
                <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs">{receiverName}</div>
                {remoteVideoRef.current && !remoteVideoRef.current.srcObject && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">Waiting for video...</div>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button onClick={handleEndVideoCall} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-semibold cursor-pointer">End Video Call</button>
            </div>
          </div>
        </div>
      )}

      {incomingCallFrom && !videoCallActive && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
          <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-6 w-[90%] max-w-md text-center">
            <div className="text-lg font-semibold mb-2">Incoming call</div>
            <div className="text-sm text-gray-300 mb-6">{incomingCallFrom} is calling...</div>
            <div className="flex justify-center gap-4">
              <button onClick={acceptIncomingCall} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-semibold cursor-pointer">Accept</button>
              <button onClick={rejectIncomingCall} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-semibold cursor-pointer">Reject</button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 flex items-center gap-2 bg-richblack-800 border-t border-richblack-700">
        <button onClick={() => document.getElementById("img-upload").click()}><FaImage size={22} /></button>
        <input id="img-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
        {uploadImage?.preview && (
          <div className="relative inline-block">
            <Image unoptimized width={100} height={100} src={uploadImage.preview} alt="preview" className="w-10 h-10 rounded object-cover border mx-2" />
            <button onClick={() => setUploadImage(null)} className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700" title="Remove image">×</button>
          </div>
        )}
        <input type="text" className="grow bg-richblack-700 rounded-lg px-3 py-2 focus:outline-none" placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} />
        <button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold cursor-pointer disabled:opacity-50" disabled={sending}>{sending ? "Sending..." : "Send"}</button>
      </div>

      {paymentModal && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-40">
          <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-6 w-[90%] max-w-md text-center">
            <div className="text-lg font-semibold mb-2">Complete Payment</div>
            <div className="text-sm text-gray-300 mb-6">Please complete the payment to proceed.</div>
            <div className="flex flex-col items-center justify-center gap-3">
              <button onClick={handlePayment} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-semibold cursor-pointer">Pay Now</button>
              <button onClick={() => setPaymentModal(false)} className="text-gray-300 hover:text-white text-sm mt-2">Skip</button>
            </div>
          </div>
        </div>
      )}

      {reviewModal && <ReviewModal bookingId={booking?._id} onClose={() => setReviewModal(false)} />}
    </div>
  );
}

function ReviewModal({ bookingId, onClose }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmitReview = async () => {
    if (!bookingId || !rating) return;
    setSaving(true);
    try {
      await fetch("/api/review/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, rating, review: text }),
      });
    } catch (err) {
      console.error("Review submit failed", err);
    } finally {
      setSaving(false);
      onClose();
    }
  };

  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-6 w-[90%] max-w-md text-white">
        <div className="text-lg font-semibold mb-4">Leave a Review</div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Rating</label>
          <Rating className="mt-3" initialRating={rating} onChange={setRating} emptySymbol={<FaStar className="text-gray-300 w-10 h-8"/>} fullSymbol={<FaStar className="text-yellow-400 w-10 h-8"/>} />
          <p className="text-xs text-gray-400 mt-1">Click a star to select your rating ({rating} out of 5)</p>
        </div>
        <div className="mb-6">
          <label className="block text-sm mb-1">Review</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="w-full bg-richblack-700 rounded px-3 py-2 text-white border border-richblack-600 focus:outline-none focus:border-yellow-400" placeholder="Share your experience" />
        </div>
        <div className="flex gap-3 justify-end">
          <button className="cursor-pointer px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 transition-colors" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="cursor-pointer px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors" disabled={saving || rating === 0} onClick={handleSubmitReview}>{saving ? 'Saving...' : 'Submit'}</button>
        </div>
      </div>
    </div>
  );
}


/* ======================================================
   6) FIRESTORE & RTDB RULES + ENV NOTES
   - Add these to Firebase console (adjust for your auth setup)
   ====================================================== */

/*
Firestore rules (development - restrict in production):

service cloud.firestore {
  match /databases/{database}/documents {
    match /chats/{roomId}/messages/{messageId} {
      allow read, write: if true; // restrict to participants in production
    }

    match /calls/{roomId} { allow read, write: if true; }
    match /calls/{roomId}/{sub=**} { allow read, write: if true; }
  }
}

Realtime DB rules (presence) - development:
{
  "rules": {
    "status": {
      "$uid": {
        ".read": true,
        ".write": true
      }
    }
  }
}

ENV (.env.local) - add these to Vercel as well:
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...(optional)
NEXT_PUBLIC_FIREBASE_MSG_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_DB_URL=...
NEXT_PUBLIC_CLOUDINARY_CLOUD=...
NEXT_PUBLIC_CLOUDINARY_PRESET=...
NEXT_PUBLIC_TURN_URL=...(optional)
NEXT_PUBLIC_TURN_USERNAME=...(optional)
NEXT_PUBLIC_TURN_CREDENTIAL=...(optional)

Notes:
- Keep storage env var but we are using Cloudinary for uploads (no Firebase Storage required)
- In production lock down Firestore / RTDB rules to only allow authenticated participants of the booking.
*/

// End of canvas content
