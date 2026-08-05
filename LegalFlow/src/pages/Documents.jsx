import { useEffect, useState } from "react";
import DataTables from "../components/DataTables";
import MessageModal from "../components/MessageModal";
import documentService from "../services/documentService";

function Documents() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState("");
    const [loadingSummaryId, setLoadingSummaryId] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    let user = null;

    try {
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined") {
            user = JSON.parse(storedUser);
        }
    } catch (err) {
        console.error("Invalid user in localStorage:", err);
        localStorage.removeItem("user");
    }

    const column = [
        { label: "Case" },
        ...(user?.role === "lawyer" ? [{ label: "Client" }] : []),
        { label: "File Name" },
        { label: "Date" },
        { label: "View" },
        { label: "Download" },
        { label: "Summarize" },
    ]

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            const res = await documentService.getDocuments();
            setDocuments(res);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleSummarize = async (documentId) => {
        // console.log("summarize button clicked")
        try {
            setLoadingSummaryId(documentId);
            const response = await documentService.summarizeDocument(documentId);
            setSummary(response.summary);
            setSelectedDocument(documentId);
            setShowSummaryModal(true);
        } catch (error) {
            console.error("Error summarizing document:", error);
            // alert("Failed to summarize document.")
            setMessage("Failed to summarize document.");
            setMessageType("error");
        } finally {
            setLoadingSummaryId(false);
        }
    }

    return (
        <div>
            <h2 className="mb-6 text-3xl font-bold">{user.role === "client" ? "My Documents" : "Assigned Case Documents"}</h2>
            <DataTables name="documents-table" loading={loading} columns={column} isEmpty={documents.length === 0} emptyMessage="Documents Not Found!!">
                {documents.map(item => {
                    return (<tr key={item.id}>
                        <td className="p-4">{item.case.title}</td>
                        {user.role === "lawyer" && (
                            <td className="p-4">{item.case.client.fullName}</td>
                        )}
                        <td className="p-4">{item.originalName}</td>
                        <td className="p-4">{new Date(item.createdAt).toLocaleString()}</td>
                        <td className="p-4"><button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            onClick={() => documentService.viewDocument(item.id)}>
                            View
                        </button></td>
                        <td className="p-4"><button className="bg-green-600 text-white px-4 py-2 hover:bg-green-700"
                            onClick={() => documentService.downloadDocument(item.id)}>
                            Download
                        </button></td>
                        <td className="p-4"><button className={`text-white px-4 py-2 rounded ${loadingSummaryId === item.id ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                            disabled={loadingSummaryId === item.id} onClick={() => handleSummarize(item.id)}>
                            {loadingSummaryId === item.id ? "Summarizing..." : "Summarize"}
                        </button></td>
                    </tr>)
                })}
            </DataTables>
            {showSummaryModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[700px] max-h-[80vh] overflow-y-auto shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">AI Document Summary</h2>
                            <div className="flex gap-5">
                                <button onClick={() => handleSummarize(selectedDocument)}
                                    className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                                    disabled={loadingSummaryId === selectedDocument}>
                                    {loadingSummaryId === selectedDocument ? "Regenerating..." : "Regenerate"}
                                </button>
                                <button onClick={() => setShowSummaryModal(false)} className="text-red-600 font-bold text-xl">✕</button>
                            </div>
                        </div>
                        <div className="whitespace-pre-wrap">
                            {summary}
                        </div>
                    </div>
                </div>
            )}
            <MessageModal message={message} type={messageType} onClose={() => setMessage("")} />
        </div>
    );
};

export default Documents;
