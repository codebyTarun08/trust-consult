// import { io } from "socket.io-client";

// const SOCKET_URL =
//   process.env.NEXT_PUBLIC_SOCKET_URL ||
//   (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

// const socket = io(SOCKET_URL, {
//   path:"/api/socket",
//   autoConnect: false,
//   transports: ["websocket"],
//   withCredentials: true,
// });

// import { io } from "socket.io-client";

// export const SOCKET_URL =
//   process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000";

// const socket = io(SOCKET_URL, {
//   path: "/socket.io",
//   transports: ["websocket","polling"],
//   autoConnect: false,
// });

// export default socket;


// import { io } from "socket.io-client";

// // Point to your Express Socket.IO server
// const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000";

// const socket = io(SOCKET_URL, {
//   path: "/socket.io", // ✅ Changed to default path
//   autoConnect: false,
//   transports: ["websocket", "polling"], // ✅ Added polling as fallback
//   withCredentials: false, // ✅ Set to false for cross-origin
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 1000,
// });

// export default socket;




import { io } from "socket.io-client";

// Use environment variable or default to localhost:8000
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000";

console.log("🔌 Connecting to Socket.IO server at:", SOCKET_URL);

const socket = io(SOCKET_URL, {
  path: "/socket.io",
  transports: ["websocket"], // ✅ Start with polling first
  autoConnect: true, // ✅ Changed to true for immediate connection
});

export default socket;