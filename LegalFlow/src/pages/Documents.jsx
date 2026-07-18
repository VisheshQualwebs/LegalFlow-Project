import { useEffect, useState } from "react";
import documentService from "../services/documentService";

function Documents() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));

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

    if (loading) {
        return <h3>Loading..</h3>
    }

    return (
        <div className="container py-4">
            <h2 className="mb-4">{user.role === "client" ? "My Documents" : "Assigned Case Documents"}</h2>
            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-black text-white">
                        <tr>
                            <th>Case</th>
                            {user.role === "lawyer" && (
                                <th>Client</th>
                            )}
                            <th>File Name</th>
                            <th>Date</th>
                            <th>View</th>
                            <th>Download</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {documents.length === 0 ? (< tr >
                            <td
                                colSpan={user.role === "lawyer" ? 6 : 5}
                                className="text-center p-4 text-muted"
                            >
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
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default Documents;
