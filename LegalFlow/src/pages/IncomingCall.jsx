import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import VideoCall from './VideoCall';

const IncomingCall = ({ user }) => {
    const [incomingCall, setIncomingCall] = useState(null);
    // const [showVideoCall, setShowVideoCall] = useState(null);
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
                    const callData = change.doc.data();
                    setIncomingCall({
                        id: change.doc.id,
                        ...callData,
                    });
                }
                if (change.type === "removed") {
                    setIncomingCall(null);
                }
            })
        })
        return () => unsubscribe();
    }, [user?.id]);

    const handleAccept = async () => {
        if (!incomingCall) return;
        try {
            const call = incomingCall;
            setActiveCall(call);
            await updateDoc(doc(db, "calls", incomingCall.id), {
                status: "accepted",
            });
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

    // if (incomingCall && showVideoCall) {
    //     return (
    //         <VideoCall callId={incomingCall.id} isCaller={false} onClose={handleCloseVideoCall} />
    //     )
    // }

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
