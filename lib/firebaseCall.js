import {
    doc,
    setDoc,
    updateDoc,
    onSnapshot,
    addDoc,
    collection,
    deleteDoc,
    getDoc
} from "firebase/firestore";

import { db } from "./firebaseConfig";

// ------------- CREATE OFFER -------------
export async function createCallOffer(roomId, offer, callerId) {
    const callRef = doc(db, "calls", roomId);

    await setDoc(callRef, {
        offer,
        callerId: callerId.id,
        callerName: callerId.name,
        status: "calling",
        createdAt: new Date(),
    });
}

// ------------- LISTEN FOR OFFER -------------
export function listenForOffer(roomId, callback) {
    const callRef = doc(db, "calls", roomId);

    return onSnapshot(callRef, (snapshot) => {
        const data = snapshot.data();
        if (data && data?.offer && data.status === "calling") {
            callback(data.offer, {
                id: data.callerId,
                name: data.callerName
            });
        }
    });
}

// ------------- CREATE ANSWER -------------
export async function createCallAnswer(roomId, answer, callee) {
    const callRef = doc(db, "calls", roomId);

    await updateDoc(callRef, {
        answer,
        calleeId: callee.id,
        calleeName: callee.name,
        status: "accepted"
    });
}

// ------------- LISTEN FOR ANSWER -------------
export function listenForAnswer(roomId, callback) {
    const callRef = doc(db, "calls", roomId);

    return onSnapshot(callRef, (snapshot) => {
        const data = snapshot.data();
        if (data && data?.answer && (data.status === "accepted" || data.answer)) {
            callback(data.answer, {
                id: data.calleeId,
                name: data.callleeName
            });
        }
    });
}

// ------------- SEND ICE CANDIDATE -------------
export async function sendIceCandidate(roomId, candidate, role) {
    // role = 'caller' | 'callee' (we'll write to the role's subcollection)
    const col = collection(db, "calls", roomId, role === "caller" ? "callerCandidates" : "calleeCandidates");
    await addDoc(col, { candidate });
}

// ------------- LISTEN FOR ICE CANDIDATES -------------
export function listenForIceCandidates(roomId, role, callback) {
    // if I'm caller, I should listen to calleeCandidates and vice-versa
    const watchRole = role === "caller" ? "calleeCandidates" : "callerCandidates";
    const col = collection(db, "calls", roomId, watchRole);
    return onSnapshot(col, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                callback(change.doc.data().candidate);
            }
        });
    });
}

export async function setCallStatus(roomId, status) {
    const callRef = doc(db, "calls", roomId);
    await updateDoc(callRef, { status });
}

// ------------- END CALL -------------
export async function clearCall(roomId) {
// Remove call document and its candidates (best-effort - deletes only the main doc)
    try {
        await deleteDoc(doc(db, "calls", roomId));
    } catch (e) {
        console.warn("Failed to clear call doc:", e.message);
    }
}
