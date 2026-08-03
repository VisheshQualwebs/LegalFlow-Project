import { useEffect, useState } from "react";
import documentService from "../services/documentService";
import { Skeleton } from "boneyard-js/react";

function Documents() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState("");
    const [loadingSummaryId, setLoadingSummaryId] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [showSummaryModal, setShowSummaryModal] = useState(false);

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
            alert("Failed to summarize document.")
        } finally {
            setLoadingSummaryId(false);
        }
    }

    return (
        <div className="container py-4">
            <h2 className="mb-6 text-3xl font-bold">{user.role === "client" ? "My Documents" : "Assigned Case Documents"}</h2>
            <Skeleton name="documents-table" loading={loading}>
                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    <table className="w-full p-4">
                        <thead className="bg-black text-white">
                            <tr>
                                <th>Case</th>
                                {user.role === "lawyer" && (
                                    <th>Client</th>
                                )}
                                <th className="p-2">File Name</th>
                                <th className="p-2">Date</th>
                                <th className="p-2">View</th>
                                <th className="p-2">Download</th>
                                <th className="p-2">Summarize</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {documents.length === 0 ? (<tr>
                                <td colSpan={user.role === "lawyer" ? 6 : 5} className="text-center p-4 text-muted">
                                    No Documents Found
                                </td>
                            </tr>
                            ) : (
                                documents.map((doc) => (
                                    <tr key={doc.id}>
                                        <td className="p-4">{doc.case?.title}</td>
                                        {user.role === "lawyer" && (
                                            <td>{doc.case?.client?.fullName}</td>
                                        )}
                                        <td className="p-4">{doc.originalName}</td>
                                        <td className="p-4">{new Date(doc.createdAt).toLocaleString()}</td>
                                        <td className="p-4"><button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                            onClick={() => documentService.viewDocument(doc.id)}>
                                            View
                                        </button></td>
                                        <td className="p-4"><button className="bg-green-600 text-white px-4 py-2 hover:bg-green-700"
                                            onClick={() => documentService.downloadDocument(doc.id)}>
                                            Download
                                        </button></td>
                                        <td className="p-4"><button className={`text-white px-4 py-2 rounded ${loadingSummaryId === doc.id ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                                            disabled={loadingSummaryId === doc.id} onClick={() => handleSummarize(doc.id)}>
                                            {loadingSummaryId === doc.id ? "Summarizing..." : "Summarize"}
                                        </button></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
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
                </div>
            </Skeleton>
        </div >
    );
};

export default Documents;
