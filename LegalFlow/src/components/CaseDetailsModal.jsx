import { useQuery } from "@tanstack/react-query";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import useAuth from "../hooks/useAuth";
import VideoCall from "../pages/VideoCall";
import caseService from "../services/caseService";

const CaseDetailsModal = ({ caseId, onClose }) => {
    const { user } = useAuth();
    const [callId, setCallId] = useState(null);
    const { data, isLoading, isError } = useQuery({
        queryKey: ["case-details", caseId],
        queryFn: () => caseService.getCaseDetails(caseId),
        enabled: !!caseId,
    })
    if (!caseId) return null;
    const caseData = data;
    const handleClick = async () => {
        console.log("button clicked!!")
        try {
            const newCallId = `${caseId}-${Date.now()}`;
            const receiverId = user.role === "client" ? caseData.lawyer?.id : caseData.client?.id;
            console.log("newCallId:", newCallId);
            console.log("receiverId:", receiverId);
            if (!receiverId) {
                console.error("Receiver not found");
                return;
            }
            console.log("error firebase")
            const resp = await setDoc(doc(db, "calls", newCallId), {
                caseId,
                callerId: user.id,
                callerName: user.fullName,
                receiverId,
                createdAt: Date.now(),
            });
            console.log(user.fullName);
            console.log("resp", resp);
            console.log("Firestore call created");
            setCallId(newCallId);
            console.log("callId state set:", newCallId);
        } catch (error) {
            console.error("Firebase error:", error.code);
            console.error("Firebase message:", error.message);
            console.error("Full error:", error);
            console.error("Failed to create call:", error);
        }
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
            <div className="bg-white w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-xl shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b">
                    <div>
                        <h2 className="text-2xl font-bold">Case Details</h2>
                        <p className="text-gray-500 mt-1">{caseData?.title || "Loading..."}</p>
                    </div>
                    <button onClick={onClose} className="border border-gray-300 rounded-lg px-2 py-1 text-gray-600 hover:bg-red-500 hover:text-white">X</button>
                </div>
                <div className="p-6">
                    {isLoading && (
                        <div className="text-center py-10">Loading Case Details...</div>
                    )}
                    {isError && (
                        <div className="text-center py-10 text-red-500">Failed to load Case Details...</div>
                    )}
                    {!isLoading && !isError && caseData && (
                        <div className="space-y-8">
                            <section>
                                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Case Info</h3>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <p className="text-sm text-black-500">Case Title</p>
                                        <p className="font-medium">{caseData.title}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Case Type</p>
                                        <p className="font-medium">{caseData.caseType}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <p className="font-medium">{caseData.status}</p>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <h3 className="text-lg font-semibold border-b pb-2">
                                    {user.role === "client" ? "Lawyer Details" : user.role === "lawyer" ? "Client Details" : "Case Members"}
                                </h3>
                                {user.role === "client" && (
                                    <div className="flex justify-between items-center w-full mt-2 rounded-lg">
                                        <div className="flex flex-col space-y-1">
                                            <p>
                                                <strong>Name: </strong>
                                                {caseData.lawyer?.fullName}
                                            </p>
                                            <p>
                                                <strong>Email: </strong>
                                                {caseData.lawyer?.email}
                                            </p>
                                        </div>
                                        <button onClick={handleClick} className="border px-5 py-3 bg-red-500 text-black rounded-lg hover:cursor-pointer">Start Video Call</button>
                                    </div>
                                )}
                                {user.role === "lawyer" && (
                                    <div className="flex justify-between items-center w-full mt-2 rounded-lg">
                                        <div className="flex flex-col space-y-1">
                                            <p>
                                                <strong>Name: </strong>
                                                {caseData.client?.fullName}
                                            </p>
                                            <p>
                                                <strong>Email: </strong>
                                                {caseData.client?.email}
                                            </p>
                                        </div>
                                        <button onClick={handleClick} className="border px-5 py-3 bg-red-500 text-black hover:cursor-pointer">Start Video Call</button>
                                    </div>
                                )}
                                {user?.role === "admin" && (
                                    <div className="space-y-2 mt-2">
                                        <p>
                                            <strong>Client:</strong>{" "}
                                            {caseData.client?.fullName || "N/A"}
                                        </p>
                                        <p>
                                            <strong>Lawyer:</strong>{" "}
                                            {caseData.lawyer?.fullName || "Not Assigned"}
                                        </p>
                                    </div>
                                )}
                            </section>
                            <section>
                                <h3 className="text-lg font-semibold border-b pb-2 mb-2">Hearing Details</h3>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <p className="text-sm text-gray-500">Hearing Date</p>
                                        <p className="font-medium">{caseData.hearingDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Hearing Time</p>
                                        <p className="font-medium">{caseData.hearingTime}</p>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <h3 className="text-lg font-semibold border-b pb-2 mb-2">Documents</h3>
                                {caseData.documents?.length > 0 ? (
                                    <div className="space-y-3">
                                        {caseData.documents.map((document) => (
                                            <div key={document.id} className="flex justify-between items-center border rounded-lg p-3">
                                                <span>{document.originalName}</span>
                                                <a href={document.filePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View</a>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No Documents</p>
                                )}
                            </section>
                            <button onClick={onClose} className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800">
                                Close
                            </button>
                            {callId && (
                                <VideoCall callId={callId} isCaller={true} onClose={() => setCallId(null)} remoteUserName={user.role === "client" ? caseData.lawyer?.fullName : caseData.client?.fullName} />
                            )}
                        </div>
                    )}
                </div>
            </div >
        </div >
    )
}

export default CaseDetailsModal