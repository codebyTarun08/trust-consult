"use client";
import { useEffect, useRef, useState } from "react";
import socket from "@/lib/socketClient";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { getBookings } from "@/services/clientService";
import { FaVideo, FaPhoneSlash, FaImage } from "react-icons/fa";
import Rating from "react-rating"
import { FaStar } from "react-icons/fa"
import Image from "next/image";
export default function ChatPage({ params }) {
  const { roomId } = params || {};
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const [localUser, setLocalUser] = useState({ name: "You", id: "" });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [uploadImage, setUploadImage] = useState(null); // Will store { file: File, preview: string }
  const [sending, setSending] = useState(false);

  const [receiverOnline, setReceiverOnline] = useState(false);
  const [receiverName, setReceiverName] = useState("Receiver");
  const [receiverAvatar, setReceiverAvatar] = useState("https://avatar.iran.liara.run/public/48");
  const [booking, setBooking] = useState(null);
  const callEndTimeout = useRef();

  const [videoCallActive, setVideoCallActive] = useState(false);
  const [incomingCallFrom, setIncomingCallFrom] = useState(null);
  const [endCallModal, setEndCallModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnection = useRef();
  const remoteMediaStream = useRef(null);
  const socketInitialized = useRef(false);
  const iceCandidateQueue = useRef([]);

  // Load local user
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      if (u) setLocalUser({ name: `${u.firstName || "User"} ${u.lastName || ""}`.trim(), id: u._id });
    } catch {}
  }, []);

  // Detect payment completion via booking status (webhook updates DB)
  useEffect(() => {
    let timer;
    const sessionId = searchParams?.get("session_id");
    if (sessionId && booking?._id) {
      const poll = async () => {
        try {
          const res = await fetch(`/api/booking/get?bookingId=${booking._id}`);
          const data = await res.json();
          if (data?.booking?.paymentStatus === "paid") {
            setReviewModal(true);
            return; // stop polling
          }
        } catch {}
        timer = setTimeout(poll, 2000);
      };
      poll();
    }
    return () => timer && clearTimeout(timer);
  }, [searchParams, booking?._id]);

  useEffect(() => {
    console.log("ChatPage mounted");
    return () => console.log("ChatPage unmounted");
  }, []);

  // Load booking info
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

          const end = new Date(current.slot.date);
          end.setHours(current.slot.endHour, 0, 0, 0);
          const ms = end.getTime() - Date.now();
          if (ms > 0) {
            callEndTimeout.current = setTimeout(() => {
              if (videoCallActive) handleEndCall();
              else setEndCallModal(true);
            }, ms);
          } else setEndCallModal(true);
        }
      } catch (e) {
        console.error("Failed to load booking:", e);
      }
    };
    loadBooking();
    return () => callEndTimeout.current && clearTimeout(callEndTimeout.current);
  }, [dispatch, roomId, videoCallActive]);

  //Loading previous chats from db
    useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(`/api/messages?roomId=${roomId}`);
        if (response.ok) {
          const data = await response.json();
          //console.log("Fetched messages:", data);
          // Transform database messages to match chat format
          const formattedMessages = data.map((msg) => ({
            sender: msg.senderId?.firstName 
              ? `${msg.senderId.firstName} ${msg.senderId.lastName || ""}`.trim()
              : "Unknown",
            senderId: msg.senderId?._id || msg.senderId,
            text: msg.type === "image" ? "" : msg.text,
            imageUrl: (msg.type === "mixed" || msg.type === "image") ? msg.imageUrl : null,
            messageId: msg._id,
            createdAt: msg.createdAt,
          }));
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    loadMessages();
  }, [roomId]);

  // Socket setup
  useEffect(() => {
    const initSocket = async () => {
      if (socketInitialized.current) return;
      socketInitialized.current = true;

      try {
        //await fetch("/api/socket"); // ✅ ensure server starts
        // await fetch( `${process.env.NEXT_PUBLIC_SOCKET_URL}/socket.io`)
        
        const rest = socket.connect();
        socket.on("connect", () => {
          console.log(" Connected to socket:", socket.id);
          socket.emit("join-room", { roomId, userId: localUser.id || "anonymous" });
          socket.emit("presence-ping", { roomId, from: localUser.id || "anonymous" });
        });

        socket.on("connect_error", (err) => console.error("Socket connect error:", err.message || err));

        // Messaging
        /*
        socket.on("receive-message", ({ message, sender, senderId, image,messageId,createdAt }) => {
          console.log("💬 New message:", message);
          setMessages((prev) => [...prev, { sender, senderId, text: message, image }]);
        });
        */
        socket.on("receive-message", ({ text, sender, senderId, imageUrl, messageId, createdAt }) => {
          //console.log("💬 New message:", text || "image", imageUrl ? "with image" : "");
          //console.log("Message details:", { sender, senderId, text, imageUrl, messageId, createdAt });
          // Check if message already exists (to prevent duplicates)
          setMessages((prev) => {
            // Check by messageId first (for real messages from DB)
            if (messageId && prev.some((msg) => msg.messageId === messageId)) {
              return prev;
            }
            // Check for optimistic message (temp ID starting with "temp-") to replace
            const optimisticIndex = prev.findIndex((msg) => 
              String(msg.senderId) === String(senderId) &&
              String(msg.messageId || "").startsWith("temp-") &&
              ((msg.text === (text || "")) || (msg.imageUrl === imageUrl))
            );
            if (optimisticIndex !== -1) {
              // Replace optimistic message with real one
              const updated = [...prev];
              updated[optimisticIndex] = { 
                sender, 
                senderId, 
                text: text || "", 
                imageUrl: imageUrl || null,
                messageId,
                createdAt
              };
              return updated;
            }
            // New message, add it
            return [...prev, { 
              sender, 
              senderId, 
              text: text || "", 
              imageUrl: imageUrl || null,
              messageId,
              createdAt
            }];
          });
        });

        // Handle message errors
        socket.on("message-error", ({ error }) => {
          console.error("Message error:", error);
          alert(`Failed to send message: ${error}`);
        });

        // Presence
        socket.on("user-connected", ({ userId }) => {
          //console.log("User connected:", userId);
          if (String(userId) !== String(localUser.id)) {
            setReceiverOnline(true);
          }
        });
        socket.on("presence-ping", ({ from }) => {
          socket.emit("presence-pong", { roomId, from: localUser.id });
          if (String(from) !== String(localUser.id)) {
            setReceiverOnline(true);
          }
        });
        socket.on("presence-pong", () => setReceiverOnline(true));
        socket.on("user-disconnected", () => setReceiverOnline(false));

        // Call events
        socket.on("call-request", ({ from, fromId }) => {
          if (String(fromId) === String(localUser.id)) return;
          setIncomingCallFrom(from || "Participant");
        });
        socket.on("call-accept", async () => {
          // When call is accepted, the caller should start the WebRTC offer
          console.log("Call accepted, starting call as caller");
          await startCall(true);
        });
        socket.on("call-reject", () => { 
          setIncomingCallFrom(null); 
          setVideoCallActive(false); 
          cleanupPeer();
        });
        socket.on("call-end", () => { 
          cleanupPeer(); 
          setVideoCallActive(false); 
          setEndCallModal(true); 
        });

        // WebRTC signaling
        /*
        socket.on("offer", async (data) => {
          try {
            console.log("Received offer");
            if (!peerConnection.current) {
              await createPeerConnection();
            }
            
            // Get local stream first
            await ensureLocalStream();
            
            // Set remote description
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
            console.log("Set remote description");
            
            // Process any queued ICE candidates
            // Note: We'll process queue after setting local description too
            
            // Create and set local answer
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            console.log("Created and set local answer");
            
            // Process queued ICE candidates now that descriptions are set
            // Use a small timeout to ensure everything is ready
            setTimeout(async () => {
              const candidates = iceCandidateQueue.current.splice(0);
              for (const candidate of candidates) {
                try {
                  await peerConnection.current.addIceCandidate(candidate);
                  console.log("Added queued ICE candidate after answer");
                } catch (error) {
                  console.warn("Failed to add queued ICE candidate:", error.message);
                }
              }
            }, 100);
            
            // Send answer to caller
            socket.emit("answer", { roomId, answer });
            
            setVideoCallActive(true);
            setIncomingCallFrom(null);
          } catch (error) {
            console.error("Error handling offer:", error);
          }
        });
        */
        socket.on("offer", async (data) => {
          try {
            console.log("Received offer");
            
            // Ensure peer connection exists
            if (!peerConnection.current) {
              await createPeerConnection();
            }
            
            // CRITICAL: Ensure local stream is set up and tracks are added BEFORE processing offer
            const localStream = await ensureLocalStream();
            
            // Verify all tracks are added to peer connection
            if (localStream) {
              const senders = peerConnection.current.getSenders();
              localStream.getTracks().forEach((track) => {
                const existingSender = senders.find(s => s.track && s.track.kind === track.kind);
                if (!existingSender) {
                  peerConnection.current.addTrack(track, localStream);
                  console.log(`Added ${track.kind} track before processing offer`);
                }
              });
            }
            
            // Set remote description (the offer)
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
            console.log("Set remote description from offer");
            
            // Create answer with options
            const answer = await peerConnection.current.createAnswer({
              offerToReceiveAudio: true,
              offerToReceiveVideo: true
            });
            
            // Set local description (the answer)
            await peerConnection.current.setLocalDescription(answer);
            console.log("Created and set local answer");
            
            // Send answer back to sender
            socket.emit("answer", { roomId, answer });
            
            // Process any queued ICE candidates
            setTimeout(async () => {
              const candidates = iceCandidateQueue.current.splice(0);
              for (const candidate of candidates) {
                try {
                  await peerConnection.current.addIceCandidate(candidate);
                  console.log("Added queued ICE candidate");
                } catch (error) {
                  console.warn("Failed to add queued ICE candidate:", error.message);
                }
              }
            }, 100);
            
            setVideoCallActive(true);
            setIncomingCallFrom(null);
          } catch (error) {
            console.error("Error handling offer:", error);
            setVideoCallActive(false);
          }
        });
        
        /*
        socket.on("answer", async (data) => {
          await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(data.answer));
        });
        */

        /*
        socket.on("answer", async (data) => {
          try {
            console.log("Answer received", data);
            if (!peerConnection.current) {
              console.error("No peer connection when answer received");
              return;
            }
            
            // Wait for local description to be set before setting remote description
            if (peerConnection.current.signalingState === "have-local-offer") {
              if (data.answer) {
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
                console.log("Set remote description from answer");
                
                // Process any queued ICE candidates now that remote description is set
                setTimeout(async () => {
                  const candidates = iceCandidateQueue.current.splice(0);
                  for (const candidate of candidates) {
                    try {
                      await peerConnection.current.addIceCandidate(candidate);
                      console.log("Added queued ICE candidate after answer");
                    } catch (error) {
                      console.warn("Failed to add queued ICE candidate:", error.message);
                    }
                  }
                }, 100);
              } else {
                console.error("Answer data missing answer field");
              }
            } else {
              console.warn("Unexpected signaling state when answer received:", peerConnection.current.signalingState);
            }
          } catch (error) {
            console.error("Error handling answer:", error);
            // Check if error is due to already set remote description
            if (error.message && error.message.includes("already")) {
              console.log("Remote description already set, continuing...");
            }
          }
        });
        */
        socket.on("answer", async (data) => {
          await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(data.answer));
        
          // Flush queued ICE candidates
          const candidates = iceCandidateQueue.current.splice(0);
          for (const candidate of candidates) {
            try {
              await peerConnection.current.addIceCandidate(candidate);
            } catch (err) {
              console.error("Failed to add queued ICE candidate:", err);
            }
          }
        });
        
        
        // socket.on("ice-candidate", async (data) => {
        //   try {
        //     if (!peerConnection.current) {
        //       console.warn("Received ICE candidate but no peer connection exists");
        //       return;
        //     }
            
        //     // Handle end of candidates (null candidate)
        //     if (data.candidate === null) {
        //       console.log("End of ICE candidates received");
        //       return;
        //     }
            
        //     // Add the ICE candidate
        //     if (data.candidate) {
        //       const candidate = new RTCIceCandidate(data.candidate);
              
        //       // Check if remote description is set
        //       if (peerConnection.current.remoteDescription) {
        //         // Remote description is set, add candidate immediately
        //         try {
        //           await peerConnection.current.addIceCandidate(candidate);
        //           console.log("Added ICE candidate:", data.candidate.candidate?.substring(0, 50));
        //         } catch (error) {
        //           // If it fails, it might be a duplicate or invalid candidate
        //           console.warn("Failed to add ICE candidate (may be duplicate):", error.message);
        //         }
        //       } else {
        //         // Queue candidate for later
        //         console.log("Queueing ICE candidate (remote description not set yet)");
        //         iceCandidateQueue.current.push(candidate);
        //       }
        //     }
        //   } catch (error) {
        //     console.error("Error adding ICE candidate:", error);
        //     // Don't throw - ICE candidate errors are often non-fatal
        //   }
        // });

        socket.on("ice-candidate", async ({ candidate }) => {
          try {
            if (!candidate) {
              console.log("End of ICE candidates");
              return;
            }
            
            if (peerConnection.current) {
              // Check if remote description is set
              if (peerConnection.current.remoteDescription) {
                try {
                  await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
                  console.log("Added ICE candidate immediately");
                } catch (e) {
                  console.warn("ICE add error:", e);
                }
              } else {
                // Queue for later
                console.log("Queueing ICE candidate (no remote description yet)");
                iceCandidateQueue.current.push(new RTCIceCandidate(candidate));
              }
            }
          } catch (error) {
            console.error("Error processing ICE candidate:", error);
          }
        });
        
      } catch (err) {
        console.error("Socket init failed:", err);
      }
    };

    initSocket();

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("receive-message");
      socket.off("message-error");
      socket.off("user-connected");
      socket.off("presence-ping");
      socket.off("presence-pong");
      socket.off("user-disconnected");
      socket.off("call-request");
      socket.off("call-accept");
      socket.off("call-reject");
      socket.off("call-end");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.disconnect();
    };
  }, [roomId, localUser.id]);

  useEffect(() => {
  const interval = setInterval(() => {
    socket.emit("presence-ping", { roomId, from: localUser.id });
  }, 5000); // every 5s
  return () => clearInterval(interval);
  }, [roomId, localUser.id]);

  // WebRTC functions
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
        console.log("Using TURN server:", turnUrl);
      }
    } catch(error) {console.error("Error configuring TURN server",error)}
    return servers;
  }
  async function createPeerConnection() {
    // Clean up any existing peer connection first
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    
    // Reset remote media stream
    if (remoteMediaStream.current) {
      remoteMediaStream.current.getTracks().forEach(track => track.stop());
      remoteMediaStream.current = null;
    }
    
    // Clear ICE candidate queue
    iceCandidateQueue.current = [];
    
    const forceTurn = String(process.env.NEXT_PUBLIC_FORCE_TURN || "false").toLowerCase() === "true";
    const pc = new RTCPeerConnection({
      iceServers: getIceServers(),
    });
    pc.onicecandidate = (e) => {
      // Send ICE candidate (including null to signal end of candidates)
      socket.emit("ice-candidate", { roomId, candidate: e.candidate });
    };
    pc.onicegatheringstatechange = () => {
      console.log("ICE gathering:", pc.iceGatheringState);
    };
    pc.ontrack = (e) => {
      try {
        console.log("ontrack event received:", {
          kind: e.track?.kind,
          id: e.track?.id,
          streams: e.streams?.length,
          trackState: e.track?.readyState
        });
        
        // Create or get the remote media stream
        if (!remoteMediaStream.current) {
          remoteMediaStream.current = new MediaStream();
          console.log("Created new remote media stream");
        }
        
        // Handle the track
        if (e.track) {
          const track = e.track;
          const existingTrack = remoteMediaStream.current.getTracks().find(t => t.id === track.id);
          
          if (!existingTrack) {
            // Add the new track
            remoteMediaStream.current.addTrack(track);
            console.log(`Added ${track.kind} track (ID: ${track.id}) to remote stream`);
            
            // Listen for track ended event
            track.onended = () => {
              console.log(`Track ${track.id} ended`);
              if (remoteMediaStream.current) {
                remoteMediaStream.current.removeTrack(track);
              }
            };
          } else {
            console.log(`Track ${track.id} already exists in remote stream`);
          }
        }
        
        // Also handle if streams are provided directly
        if (e.streams && e.streams.length > 0) {
          e.streams.forEach(stream => {
            stream.getTracks().forEach(track => {
              const existingTrack = remoteMediaStream.current.getTracks().find(t => t.id === track.id);
              if (!existingTrack) {
                remoteMediaStream.current.addTrack(track);
                console.log(`Added ${track.kind} track from stream (ID: ${track.id})`);
              }
            });
          });
        }
        
        // Log current stream state
        const tracks = remoteMediaStream.current.getTracks();
        console.log(`Remote stream now has ${tracks.length} tracks:`, tracks.map(t => `${t.kind} (${t.id})`));
        
        // Update the video element with the remote stream
        if (remoteVideoRef.current) {
          // Only update if the stream has changed or video element has no stream
          if (remoteVideoRef.current.srcObject !== remoteMediaStream.current) {
            remoteVideoRef.current.srcObject = remoteMediaStream.current;
            //console.log("Updated remote video element with stream");
            
            // Try to play the video
            const playPromise = remoteVideoRef.current.play();
            if (playPromise && typeof playPromise.then === "function") {
              playPromise
                .then(() => {
                  console.log("Remote video playing successfully");
                })
                .catch(err => {
                  console.error("Error playing remote video:", err);
                });
            }
          }
        } else {
          console.warn("Remote video ref is not available");
        }
      } catch (error) {
        console.error("Error in ontrack handler:", error);
      }
    };
    pc.onconnectionstatechange = () => {
      console.log("RTC state:", pc.connectionState);
    };
    pc.oniceconnectionstatechange = () => {
      console.log("ICE state:", pc.iceConnectionState);
    };
    peerConnection.current = pc;
  }

  async function ensureLocalStream() {
    // Return existing stream if available
    if (localVideoRef.current?.srcObject) {
      const existingStream = localVideoRef.current.srcObject;
      // Verify tracks are still active
      const activeTracks = existingStream.getTracks().filter(t => t.readyState === "live");
      if (activeTracks.length > 0) {
        return existingStream;
      }
    }
    
    // Get new media stream
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { width: 1280, height: 720 }, 
      audio: true 
    });
    
    // Ensure peer connection exists
    if (!peerConnection.current) {
      await createPeerConnection();
    }
    
    // Add tracks to peer connection
    stream.getTracks().forEach((track) => {
      // Check if track already exists
      const sender = peerConnection.current.getSenders().find(s => s.track && s.track.kind === track.kind);
      if (sender) {
        // Replace existing track
        sender.replaceTrack(track);
      } else {
        // Add new track
        peerConnection.current.addTrack(track, stream);
      }
    });
    
    // Set local video element
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
      const playPromise = localVideoRef.current.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch(err => {
          console.error("Error playing local video:", err);
        });
      }
    }
    
    return stream;
  }

  function cleanupPeer() {
    try {
      // Stop local stream tracks
      const localStream = localVideoRef.current?.srcObject;
      if (localStream && localStream.getTracks) {
        localStream.getTracks().forEach((track) => {
          track.stop();
        //  console.log("Stopped local track:", track.kind);
        });
      }
      
      // Stop remote stream tracks
      if (remoteMediaStream.current) {
        remoteMediaStream.current.getTracks().forEach((track) => {
          track.stop();
         // console.log("Stopped remote track:", track.kind);
        });
        remoteMediaStream.current = null;
      }
      
      // Clear video elements
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      
      // Clear ICE candidate queue
      iceCandidateQueue.current = [];
      
      // Close peer connection
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
       // console.log("Closed peer connection");
      }
    } catch (error) {
      console.error("Error cleaning up peer connection:", error);
    }
  }

  async function uploadToCloudinary(file) {
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`, { method: "POST", body: form });
      if (!res.ok) {
        throw new Error(`Upload failed: ${res.statusText}`);
      }
      const data = await res.json();
      if (!data.secure_url) {
        throw new Error("No secure_url in response");
      }
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  }

  // Messaging
  /*
  function handleSendMessage() {
    if ((!input.trim() && !uploadImage) || sending) return;
    setSending(true);
    const msgData = {
      roomId,
      message: input,
      sender: localUser.name,
      senderId: localUser.id,
      image: uploadImage || null,
    };
    socket.emit("send-message", msgData);
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    setMessages((p) => [...p, { sender: localUser.name, senderId: localUser.id, text: input, image: uploadImage, messageId:tempId ,createdAt: new Date() }]);
    setInput("");
    setUploadImage(undefined);
    setSending(false);
  }
  */
async function handleSendMessage() {
  if ((!input.trim() && !uploadImage) || sending) return;
  setSending(true);

  let imageUrl = null;
  const imageFile = uploadImage?.file;

  try {
    // Upload image (if exists)
    if (imageFile) {
      imageUrl = await uploadToCloudinary(imageFile);
    }

    // Only proceed if we have either text or a successfully uploaded image
    if (!input.trim() && !imageUrl) {
      setSending(false);
      return;
    }

    // Optimistic UI message (temporary)
    const tempId = `temp-${Date.now()}`;
    //console.log("Input:", input, "ImageURL:", imageUrl);
    //console.log("LocalUser:", localUser); 
    setMessages((p) => [
      ...p,
      {
        sender: localUser.name,
        senderId: localUser.id,
        text: input.trim(),
        imageUrl,
        type: imageUrl && input.trim() ? "mixed" : imageUrl ? "image" : "text",
        messageId: tempId,
        createdAt: new Date(),
      }
    ]);

    // Send to server over socket (where DB save will happen)
    socket.emit("send-message", {
      roomId,
      sender: localUser.name,
      senderId: localUser.id,
      text: input.trim() || "",
      imageUrl: imageUrl || null,
    });

    setInput("");
    setUploadImage(null);
  } catch (error) {
    console.error("Error sending message:", error);
    alert("Failed to upload image. Please try again.");
  } finally {
    setSending(false);
  }
}



  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadImage({
        file: file, // Store the actual File object for uploading
        preview: reader.result // Store base64 for preview
      });
    };
    reader.readAsDataURL(file);
  }

  // Call Controls
  async function handleStartCall() {
    try {
      //console.log("Initiating call - preparing local setup");
      setVideoCallActive(true);
      
      // Prepare local stream and peer connection BEFORE sending call request
      await ensureLocalStream();
      if (!peerConnection.current) {
        await createPeerConnection();
      }
      
      // Emit call request after setup is ready
      socket.emit("call-request", { roomId, from: localUser.name, fromId: localUser.id });
    } catch (error) {
      console.error("Error preparing call setup:", error);
      setVideoCallActive(false);
    }
  }
  async function acceptIncomingCall() {
    try {
      // console.log("Accepting incoming call");
      
      // Set up local stream and peer connection BEFORE emitting acceptance
      setVideoCallActive(true);
      await ensureLocalStream();
      
      if (!peerConnection.current) {
        await createPeerConnection();
      }
      
      // Verify tracks are added to peer connection
      const localStream = localVideoRef.current?.srcObject;
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          const sender = peerConnection.current.getSenders().find(s => s.track && s.track.kind === track.kind);
          if (!sender) {
            peerConnection.current.addTrack(track, localStream);
            //console.log(`Added ${track.kind} track to peer connection`);
          }
        });
      }
      
      // Now emit acceptance - caller will send offer
      socket.emit("call-accept", { roomId, by: localUser.name, byId: localUser.id });
      setIncomingCallFrom(null);
    } catch (error) {
      console.error("Error accepting call:", error);
      setVideoCallActive(false);
    }
  }
  
  function rejectIncomingCall() {
    socket.emit("call-reject", { roomId, by: localUser.name, byId: localUser.id });
    setIncomingCallFrom(null);
  }
  async function startCall(asCaller) {
    try {
     // console.log("Starting call, asCaller:", asCaller);
      setVideoCallActive(true);
      
      // Ensure local stream is ready FIRST (this adds tracks to peer connection)
      const localStream = await ensureLocalStream();
      
      // Ensure peer connection exists
      if (!peerConnection.current) {
        await createPeerConnection();
        // If peer connection was just created, we need to add tracks again
        if (localStream) {
          localStream.getTracks().forEach((track) => {
            const sender = peerConnection.current.getSenders().find(s => s.track && s.track.kind === track.kind);
            if (!sender) {
              peerConnection.current.addTrack(track, localStream);
              //console.log(`Added ${track.kind} track to peer connection`);
            }
          });
        }
      } else {
        // Verify tracks are added to existing peer connection
        const senders = peerConnection.current.getSenders();
        const hasVideo = senders.some(s => s.track && s.track.kind === "video");
        const hasAudio = senders.some(s => s.track && s.track.kind === "audio");
        
        if (localStream) {
          if (!hasVideo || !hasAudio) {
            localStream.getTracks().forEach((track) => {
              const sender = senders.find(s => s.track && s.track.kind === track.kind);
              if (!sender) {
                peerConnection.current.addTrack(track, localStream);
               // console.log(`Added missing ${track.kind} track to peer connection`);
              }
            });
          }
        }
      }
      
      if (asCaller) {
        // Wait a brief moment to ensure tracks are fully added
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Verify we have tracks before creating offer
        const senders = peerConnection.current.getSenders();
       // console.log(`Creating offer with ${senders.length} senders:`, senders.map(s => s.track?.kind));
        
        // Create offer with options for better compatibility
        const offer = await peerConnection.current.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true
        });
        
        await peerConnection.current.setLocalDescription(offer);
       // console.log("Created and set local offer");
        
        // Send offer to the other peer
        socket.emit("offer", { roomId, offer });
      }
    } catch (error) {
      console.error("Error starting call:", error);
    }
  }
  function handleEndCall() {
    socket.emit("call-end", { roomId, by: localUser.name, byId: localUser.id });
    setVideoCallActive(false);
    setEndCallModal(true);
    // Mark booking as completed, then open payment modal
    if (booking?._id) {
      fetch("/api/booking/complete", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking._id }),
      }).finally(() => setPaymentModal(true));
    } else {
      setPaymentModal(true);
    }
    cleanupPeer();
  }
// 💳 Payment Handler (add this inside ChatPage)
async function handlePayment() {
  try {
    if (!booking?._id) {
      alert("Booking ID missing");
      return;
    }

    // Create Stripe Checkout session (test mode)
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
      // Redirect to Stripe checkout
      window.location.href = data.url;
    } else {
      alert("Payment session could not be created.");
    }
  } catch (error) {
    console.error("Payment error:", error);
    alert("Something went wrong while initiating payment.");
  }
}
// Detect payment success after redirect
useEffect(() => {
  const sessionId = searchParams?.get("session_id");
  if (!sessionId) return;

  const verifyPayment = async () => {
    try {
      const res = await fetch(`/api/payment/verify-session?session_id=${sessionId}`);
      const data = await res.json();
      if (data?.paid) {
        //console.log("Payment successful, booking updated:", data.booking);
        setReviewModal(true); // Open review modal
        setPaymentModal(false);
      } else {
        console.warn("Payment not yet confirmed or failed");
      }
    } catch (err) {
      console.error("Payment verification failed:", err);
    }
  };

  verifyPayment();
}, [searchParams]);


  // UI rendering (same as before)
  return (
    <div className="flex flex-col h-screen bg-richblack-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-richblack-800 shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-4">
            <Image
              unoptimized
              width={100}
              height={100}
              src={receiverAvatar}
              alt="avatar"
              className={`rounded-full object-cover border w-12 h-12 shadow-sm`}
            />
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

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-2 bg-richblack-900">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col max-w-xs rounded-xl p-2 ${String(msg.senderId) === String(localUser.id) ? "self-end bg-blue-600" : "self-start bg-richblack-700"}`}>
            {msg.imageUrl && <Image width={100} height={100} unoptimized src={msg.imageUrl} alt="sent" className="rounded mb-2 max-h-40 object-contain" />}
            <span>{msg.text}</span>
            <span className="text-[10px] text-gray-300 text-right">{msg?.sender}</span>
          </div>
        ))}
      </div>

      {/* Video Call Panel */}
      {videoCallActive && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
          <div className="w-full max-w-4xl px-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2 relative">
                <video 
                  ref={localVideoRef} 
                  autoPlay 
                  muted 
                  playsInline 
                  className="w-full rounded-lg bg-black border border-richblack-700 aspect-video object-cover" 
                />
                <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs">You</div>
              </div>
              <div className="w-full md:w-1/2 relative">
                <video 
                  ref={remoteVideoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full rounded-lg bg-black border border-richblack-700 aspect-video object-cover" 
                />
                <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs">{receiverName}</div>
                {remoteVideoRef.current && !remoteVideoRef.current.srcObject && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Waiting for video...
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button onClick={handleEndCall} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-semibold cursor-pointer">End Video Call</button>
            </div>
          </div>
        </div>
      )}

      {/* Incoming Call Overlay */}
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

      {/* Message Input */}
      <div className="p-4 flex items-center gap-2 bg-richblack-800 border-t border-richblack-700">
        <button onClick={() => document.getElementById("img-upload").click()}><FaImage size={22} /></button>
        <input id="img-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
        {uploadImage?.preview && (
          <div className="relative inline-block">
            <Image unoptimized width={100} height={100} src={uploadImage.preview} alt="preview" className="w-10 h-10 rounded object-cover border mx-2" />
            <button
              onClick={() => setUploadImage(null)}
              className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
              title="Remove image"
            >
              ×
            </button>
          </div>
        )}
        <input
          type="text"
          className="flex-grow bg-richblack-700 rounded-lg px-3 py-2 focus:outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold cursor-pointer disabled:opacity-50" disabled={sending}>
          {sending ? "Sending..." : "Send"}
        </button>
      </div>

      {/* Payment Modal */}
  {paymentModal && (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-40">
      <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-6 w-[90%] max-w-md text-center">
        <div className="text-lg font-semibold mb-2">Complete Payment</div>
        <div className="text-sm text-gray-300 mb-6">
          Please complete the payment to proceed.
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <button
            onClick={handlePayment} // ✅ FIXED
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-semibold cursor-pointer"
          >
            Pay Now
          </button>
          <button
            onClick={() => setPaymentModal(false)}
            className="text-gray-300 hover:text-white text-sm mt-2"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  )}


      {/* Review Modal (Client side) */}
      {reviewModal && (
        <ReviewModal
          bookingId={booking?._id}
          onClose={() => setReviewModal(false)}
        />
      )}
    </div>
  );
}
 

function ReviewModal({ bookingId, onClose }) {
  // Initialize rating state with a default value (e.g., 5 or 0)
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  // Function to handle the rating submission logic
  const handleSubmitReview = async () => {
    if (!bookingId || !rating) return; // Basic validation
    
    setSaving(true);
    try {
      await fetch("/api/review/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Use the current rating state value
        body: JSON.stringify({ bookingId, rating, review: text }), 
      });
    } catch (error) {
        console.error("Error submitting review:", error);
        // Optionally show a toast notification for failure
    } finally {
      setSaving(false);
      onClose(); // Close the modal regardless of success/failure
    }
  };

  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-6 w-[90%] max-w-md text-white">
        
        <div className="text-lg font-semibold mb-4">Leave a Review</div>
        
        <div className="mb-4">
          <label className="block text-sm mb-1">Rating</label>
           <Rating
            className="mt-3"
            initialRating={rating} // Current state value
            onChange={setRating}   // Function to update the state on click
            emptySymbol={<FaStar className="text-gray-300 w-10 h-8"/>}
            fullSymbol={<FaStar className="text-yellow-400 w-10 h-8"/>}
            // Removed: readonly={true}, fetchractions, and initialRating={ratingCount.average || 0}
           />
           <p className="text-xs text-gray-400 mt-1">Click a star to select your rating (${rating} out of 5)</p>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm mb-1">Review</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full bg-richblack-700 rounded px-3 py-2 text-white border border-richblack-600 focus:outline-none focus:border-yellow-400"
            placeholder="Share your experience"
          />
        </div>
        
        <div className="flex gap-3 justify-end">
          <button
            className="cursor-pointer px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 transition-colors"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="cursor-pointer px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
            disabled={saving || rating === 0} // Disable if saving or if no rating is selected (assuming 0 is not a valid rating)
            onClick={handleSubmitReview}
          >
            {saving ? 'Saving...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

function StripePayNowButton({ bookingId, onStarted }) {
  const [loading, setLoading] = useState(false);
  return (
    <></>
  );
}