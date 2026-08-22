import { addDoc, collection, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";
import { BsCameraVideo, BsCameraVideoOff } from "react-icons/bs";
import { IoIosShare } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";
import { PiCopySimpleLight } from "react-icons/pi";
import { db } from "../firebase/firebaseConfig";

const VideoCall = ({ callId, isCaller, onClose, remoteUserName }) => {
    const [isCameraOn, setIsCameraOn] = useState(true)
    const [mic, setMic] = useState(true);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const pendingCandidatesRef = useRef([]);
    const [connected, setConnected] = useState(false);
    const [minimized, setMinimized] = useState(false);

    useEffect(() => {
        let unsubscribeCall;
        let unsubscribeCandidates;
        let missedCallTimer;
        const startCall = async () => {
            try {
                console.log("Video call component mounted")
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });

                localStreamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
                console.log("Camera and audio")

                const peerConnection = new RTCPeerConnection({
                    iceServers: [
                        {
                            urls: [
                                "stun:stun.l.google.com:19302",
                                "stun:stun1.l.google.com:19302"
                            ]
                        },
                        {
                            urls: "turn:YOUR_SERVER_IP:3478",
                            username: "legalflow",
                            credential: "YOUR_STRONG_PASSWORD"
                        }
                    ]
                });

                peerConnectionRef.current = peerConnection;
                stream.getTracks().forEach((track) => {
                    peerConnection.addTrack(track, stream);
                });

                peerConnection.ontrack = (event) => {
                    console.log("Remote Stream")
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = event.streams[0];
                    }
                };

                peerConnection.onconnectionstatechange = () => {
                    console.log("connection", peerConnection.connectionState);
                    if (peerConnection.connectionState === "connected") {
                        setConnected(true);
                    }
                    if (peerConnection.connectionState === "failed" || peerConnection.connectionState === "disconnected" || peerConnection.connectionState === "closed") {
                        setConnected(false);
                    }
                };

                const callRef = doc(db, "calls", callId);
                const candidatesCollection = collection(
                    callRef,
                    isCaller ? "callerCandidates" : "calleeCandidates"
                );

                peerConnection.onicecandidate = async (e) => {
                    if (e.candidate) {
                        await addDoc(candidatesCollection, e.candidate.toJSON());
                    }
                };

                if (isCaller) {
                    console.log("I am a caller")
                    const offer = await peerConnection.createOffer();
                    await peerConnection.setLocalDescription(offer);
                    await updateDoc(callRef, {
                        offer: {
                            type: offer.type,
                            sdp: offer.sdp,
                        },
                        status: "ringing",
                        createdAt: Date.now(),
                        expiresAt: Date.now() + 30000,
                    });
                    missedCallTimer = setTimeout(async () => {
                        try {
                            const snapshot = await getDoc(callRef);
                            if (snapshot.exists() && snapshot.data().status === "ringing") {
                                await updateDoc(callRef, {
                                    status: "missed"
                                })
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }, 30000);
                    console.log("offer created");
                    unsubscribeCall = onSnapshot(callRef, async (snapshot) => {
                        const data = snapshot.data();
                        if (data?.status === "rejected") {
                            console.log("rejected");
                            stopMedia();
                            onClose();
                            return;
                        }
                        if (data?.status === "missed") {
                            console.log("missed call");
                            stopMedia();
                            onClose();
                            return;
                        }
                        if (data?.status === "ended") {
                            console.log("end call");
                            stopMedia();
                            onClose();
                            return;
                        }
                        if (data?.answer && !peerConnection.remoteDescription) {
                            console.log("Answer Recieved");
                            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
                            for (const candidate of pendingCandidatesRef.current) {
                                await peerConnection.addIceCandidate(candidate);
                            }
                            pendingCandidatesRef.current = [];
                        }
                    });
                } else {
                    unsubscribeCall = onSnapshot(callRef, async (snapshot) => {
                        const data = snapshot.data();
                        if (data?.status === "ended") {
                            console.log("other user end call");
                            stopMedia();
                            onClose();
                            return;
                        }
                        if (data?.offer && !peerConnection.remoteDescription) {
                            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
                            for (const candidate of pendingCandidatesRef.current) {
                                await peerConnection.addIceCandidate(candidate);
                            }
                            pendingCandidatesRef.current = [];
                            const answer = await peerConnection.createAnswer();
                            await peerConnection.setLocalDescription(answer);
                            await updateDoc(callRef, {
                                answer: {
                                    type: answer.type,
                                    sdp: answer.sdp,
                                },
                                status: "accepted",
                            });
                        }
                    });
                }

                const remoteCandidatesCollection = collection(callRef, isCaller ? "calleeCandidates" : "callerCandidates");
                unsubscribeCandidates = onSnapshot(remoteCandidatesCollection, async (snapshot) => {
                    for (const change of snapshot.docChanges()) {
                        if (change.type !== "added") continue;
                        const candidate = new RTCIceCandidate(change.doc.data());
                        if (peerConnection.remoteDescription) {
                            await peerConnection.addIceCandidate(candidate);
                        } else {
                            pendingCandidatesRef.current.push(candidate);
                        }
                    }
                });
            } catch (error) {
                console.error("video call failed", error)
            }
        };
        startCall();
        return () => {
            if (missedCallTimer) {
                clearTimeout(missedCallTimer);
            }
            unsubscribeCall?.();
            unsubscribeCandidates?.();
            stopMedia();
        };
    }, [callId, isCaller]);

    const stopMedia = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
                track.stop();
                console.log("stopped", track.kind);
            });
            localStreamRef.current = null;
        }

        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
        }

        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }

        if (peerConnectionRef.current) {
            peerConnectionRef.current.ontrack = null;
            peerConnectionRef.current.onicecandidate = null;
            peerConnectionRef.current.onconnectionstatechange = null;
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        setConnected(false);
    }

    const handleEndCall = async () => {
        try {
            const callRef = doc(db, "calls", callId);
            await updateDoc(callRef, {
                status: "ended",
            })
            stopMedia();
            onClose();
        } catch (error) {
            console.log("failed to end")
            stopMedia();
            onClose();
        }
    }

    const handleCamera = () => {
        const stream = localStreamRef.current?.getVideoTracks()[0];
        if (!stream) return;
        stream.enabled = !stream.enabled;
        setIsCameraOn(stream.enabled);
        console.log("Camera off")
    }

    const handleAudio = () => {
        const stream = localStreamRef.current?.getAudioTracks()[0];
        if (!stream) return;
        stream.enabled = !stream.enabled;
        setMic(stream.enabled);
        console.log("Mic off")
    }

    const handleScreenShare = async () => {
        try {
            console.log("screen share Clicked")
            const streamVideo = await navigator.mediaDevices.getDisplayMedia({
                audio: true,
                video: true,
            })
            const trackScreen = streamVideo.getVideoTracks()[0];
            const sender = peerConnectionRef.current.getSenders().find((sender) => sender.track?.kind === "video");
            if (sender) {
                console.log("screen share on")
                await sender.replaceTrack(trackScreen);
                console.log("screen share still on")
            }
        } catch (error) {
            console.log("unable to share screen", error);
        }
    }

    return (
        // <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4">
        <div className={`fixed z-[100] bg-black text-white shadow-2xl overflow-hidden transition-all duration-300 ${minimized ? "bottom-5 right-5 w-[400px] h-[280px] rounded-lg" : "inset-0"}`}>
            <div className="h-12 bg-gray flex items-center justify-between px-4">
                <span className="text-white font-medium">{connected ? "Connected" : "Connecting..."}</span>
                <div className="flex items-center gap-2">
                    <button onClick={() => setMinimized(!minimized)} className="w-8 h-8 hover:bg-gray-700 font-medium text-2xl flex items-center justify-center">
                        {minimized ? <PiCopySimpleLight /> : "-"}
                    </button>
                </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4 p-6 min-h-0">
                <div className="relative bg-gray-900 rounded-xl overflow-hidden">
                    <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                    <span className="absolute bottom-3 left-3 bg-black/75 text-white p-3 py-1 rounded">You</span>
                </div>
                <div className="relative bg-gray-900 rounded-xl overflow-hidden">
                    <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <span className="absolute bottom-3 left-3 bg-black/75 text-white p-3 py-1 rounded">{remoteUserName || "Remote User"}</span>
                </div>
            </div>
            {/* <div className="h-15 shrink-0 bg-gray-900 flex items-center justify-center gap-6 border-t border-gray-700"> */}
            <div className={`shrink-0 bg-gray-900 flex items-center justify-center gap-6 border-t border-gray-700 ${minimized ? "h-10" : "h-20"}`}>
                <button onClick={handleCamera} className={`${minimized ? "px-3 py-1 rounded-full font-medium" : "px-6 py-3 rounded-full font-medium"} items-center ${isCameraOn ? 'bg-white text-black hover:bg-gray-600' : 'bg-white border-gray-300 text-black hover:bg-gray-100'}`} >
                    <span>{isCameraOn ? <BsCameraVideoOff title='off camera' /> : <BsCameraVideo title='on camera' />}</span>
                </button>
                <button onClick={handleAudio} className={`${minimized ? "px-3 py-1 rounded-full font-medium" : "px-6 py-3 rounded-full font-medium"} items-center ${mic ? 'bg-white text-black hover:bg-gray-600' : 'bg-white border-gray-300 text-black hover:bg-gray-100'}`} >
                    <span>{mic ? <AiOutlineAudioMuted title='mute mic' /> : <AiOutlineAudio title='unmute mic' />}</span>
                </button>
                <button onClick={handleScreenShare} title='share screen' className={`${minimized ? "px-3 py-1 rounded-full font-medium" : "px-6 py-3 rounded-full font-medium"} items-center bg-white text-black hover:bg-gray-600`} >
                    <IoIosShare />
                </button>
                <button onClick={handleEndCall} title='End Call' className={`bg-red-500 hover:bg-red-600 text-white ${minimized ? "px-3 py-1 rounded-full font-medium" : "px-6 py-3 rounded-full font-medium"}`}>
                    <MdCallEnd />
                </button>
            </div>
        </div>
    )
}

export default VideoCall
