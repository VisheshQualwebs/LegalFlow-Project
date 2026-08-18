import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import VideoCall from './VideoCall';

const IncomingCall = ({ user }) => {
    const [incomingCall, setIncomingCall] = useState(null);
    const [showVideoCall, setShowVideoCall] = useState(null);
    const [activeCall, setActiveCall] = useState(null);

    useEffect(() => {
        if (!user.id) return;
        const callsQuery = query(
            collection(db, "calls"),
            where("receiverId", "==", user.id),
            where("status", "==", "ringing")
        );

        const unsubscribe = onSnapshot(callsQuery, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const callData = {
                        id: change.doc.id,
                        ...change.doc.data()
                    };
                    if (callData.expiresAt && callData.expiresAt <= Date.now()) return;
                    setIncomingCall(callData);
                }
                if (change.type === "modified") {
                    const callData = {
                        id: change.doc.id,
                        ...change.doc.data()
                    };
                    if (callData.expiresAt && callData.expiresAt <= Date.now()) {
                        setIncomingCall(null);
                        return;
                    }
                    setIncomingCall(callData);
                }
                if (change.type === "removed") {
                    setIncomingCall(null);
                }
            })
        })
        return () => unsubscribe();
    }, [user?.id]);

    useEffect(() => {
        if (!incomingCall?.expiresAt) return;
        const remainingTime = incomingCall.expiresAt - Date.now();
        if (remainingTime <= 0) {
            setIncomingCall(null)
            return;
        }
        const timer = setTimeout(async () => {
            try {
                await updateDoc(
                    doc(db, "calls", incomingCall.id),
                    {
                        status: "missed"
                    }
                )
            } catch (error) {
                console.log(error);
            }
            setIncomingCall(null);
        }, remainingTime);
        return () => clearTimeout(timer);
    }, [incomingCall])

    const handleAccept = async () => {
        if (!incomingCall) return;
        if (incomingCall.expiresAt && incomingCall.expiresAt <= Date.now()) {
            setIncomingCall(null);
            return;
        }
        try {
            await updateDoc(doc(db, "calls", incomingCall.id), {
                status: "accepted",
            });
            setActiveCall(incomingCall);
            // setShowVideoCall(true);
        } catch (error) {
            console.log("failed to Accept a call", error);
        }
    }

    const handleReject = async () => {
        if (!incomingCall) return;
        try {
            await updateDoc(doc(db, "calls", incomingCall.id), {
                status: "rejected",
            });
            setIncomingCall(null);
        } catch (error) {
            console.log("failed to reject", error);
        }
    }

    const handleCloseVideoCall = () => {
        // setShowVideoCall(false);
        setActiveCall(null);
        setIncomingCall(null);
    }

    if (activeCall) {
        return (
            <VideoCall callId={activeCall.id} isCaller={false} onClose={handleCloseVideoCall} />
        )
    }

    if (!incomingCall) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 text-center">
                <h2 className="text-2xl font-bold mb-2">Incoming Video Call</h2>
                <p className="text-gray-500 mb-6">Someone is calling you</p>
                <div className="flex justify-center gap-4">
                    <button onClick={handleAccept} className="bg-green-500 hover:bg-green-600 border rounded-lg px-6 py-3 text-white">Accept</button>
                    <button onClick={handleReject} className="bg-red-500 hover:bg-red-600 border rounded-lg px-6 py-3 text-white">Reject</button>
                </div>
            </div>
        </div >
    )
}

export default IncomingCall
