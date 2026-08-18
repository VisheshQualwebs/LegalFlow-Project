import { addDoc, collection, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";
import { BsCameraVideo, BsCameraVideoOff } from "react-icons/bs";
import { db } from "../firebase/firebaseConfig";

const VideoCall = ({ callId, isCaller, onClose }) => {
    const [isCameraOn, setIsCameraOn] = useState(true)
    const [mic, setMic] = useState(true);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const pendingCandidatesRef = useRef([]);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        let unsubscribeCall;
        let unsubscribeCandidates;
        let missedCallTimer;
        let mounted = true;
        const startCall = async () => {
            try {
                console.log("Video call component mounted")
                // Camera and audio on
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });

                if (!mounted) {
                    stream.getTracks().forEach((track) => track.stop());
                    return;
                }

                localStreamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
                console.log("Camera and audio")

                // Real Time connection using stun server to connect our IP and port to the internet
                const peerConnection = new RTCPeerConnection({
                    iceServers: [{
                        urls: "stun:stun.l.google.com:19302"
                    }]
                });

                // adding a audio vide in the stun server
                peerConnectionRef.current = peerConnection;
                stream.getTracks().forEach((track) => {
                    peerConnection.addTrack(track, stream);
                });

                // adding a remote user video and audio to the server
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

                // Creating a DB in the firebase with the "calls" name called as Collection with the "callId" document.
                const callRef = doc(db, "calls", callId);
                const candidatesCollection = collection(
                    callRef,
                    isCaller ? "callerCandidates" : "calleeCandidates"
                );

                // adding a remote user data in the db
                peerConnection.onicecandidate = async (e) => {
                    if (e.candidate) {
                        await addDoc(candidatesCollection, e.candidate.toJSON());
                    }
                };

                // Creating a call
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
                        expiresAt: Date.now() + 30 * 1000,
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
            mounted = false;
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

    return (
        // <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4">
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
            <span className="text-white text-center">{connected ? "Connected" : "Connecting..."}</span>
            <div className="flex-1 grid grid-cols-2 gap-4 p-6 min-h-0">
                <div className="relative bg-gray-900 rounded-xl overflow-hidden">
                    <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                    <span className="absolute bottom-3 left-3 bg-black/75 text-white p-3 py-1 rounded">You</span>
                </div>
                <div className="relative bg-gray-900 rounded-xl overflow-hidden">
                    <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <span className="absolute bottom-3 left-3 bg-black/75 text-white p-3 py-1 rounded">Remote User</span>
                </div>
            </div>
            <div className="h-20 shrink-0 bg-gray-900 flex items-center justify-center gap-6 border-t border-gray-700">
                <button onClick={handleCamera} className={`px-4 py-2 rounded-full items-center ${isCameraOn ? 'bg-white text-black hover:bg-gray-600' : 'bg-white border-gray-300 text-black hover:bg-gray-100'}`} >
                    <span>{isCameraOn ? <BsCameraVideoOff /> : <BsCameraVideo />}</span>
                </button>
                <button onClick={handleAudio} className={`px-4 py-2 rounded-full items-center ${mic ? 'bg-white text-black hover:bg-gray-600' : 'bg-white border-gray-300 text-black hover:bg-gray-100'}`} >
                    <span>{mic ? <AiOutlineAudioMuted /> : <AiOutlineAudio />}</span>
                </button>
                <button onClick={handleEndCall} className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-medium">End Call</button>
            </div>
        </div>
    )
}

export default VideoCall
