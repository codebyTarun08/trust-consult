import { ref, set, onDisconnect, onValue } from "firebase/database";
import { rtdb } from "./firebaseConfig";


export function setUserOnline(userId) {
    if (!userId) return;
    const userRef = ref(rtdb, `status/${userId}`);
    set(userRef, {
        state: "online",
        lastChanged: Date.now(),
    });
    onDisconnect(userRef).set({ state: "offline", lastChanged: Date.now() });
}


export function setUserOffline(userId) {
    if (!userId) return;
    const userRef = ref(rtdb, `status/${userId}`);
    set(userRef, {
        state: "offline",
        lastChanged: Date.now(),
    });
}


export function listenToPresence(userId, callback) {
    const userRef = ref(rtdb, `status/${userId}`);
    const unsub = onValue(userRef, (snap) => {
        const val = snap.val();
        callback(!!val && val.state === "online", val);
    });
    return () => unsub();
}