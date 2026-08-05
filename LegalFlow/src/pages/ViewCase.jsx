import { useEffect, useState } from "react";
import DataTables from "../components/DataTables";
import MessageModal from "../components/MessageModal";
import useAuth from "../hooks/useAuth";
import caseService from "../services/caseService";

function ViewCase() {
    const [cases, setCases] = useState([]);
    const [status, setStatus] = useState("all");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [deleteCaseId, setDeleteCaseId] = useState(null);
    const { user } = useAuth();

    const columns = [
        { label: "Case" }, { label: "Client" }, { label: "Lawyer" }, { label: "Status", className: "text-center" }
    ]

    if (user?.role === "admin" || user?.role === "client") {
        columns.push({ label: "Action" });
    }

    const fetchCases = async (selectedStatus = "all") => {
        try {
            const params = selectedStatus === "all" ? {} : { status: selectedStatus };
            const response = await caseService.list(params);
            setCases(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCases(status);
    }, [status]);

    const handleDelete = async (id) => {
        // const confirmDelete = window.confirm("Are you sure you want to delete this case?");
        // if (!confirmDelete) {
        //     return;
        // }
        setDeleteCaseId(id);
        setMessage("Are you sure you want to delete this case?");
        setMessageType("confirm");
    }

    const handleConfirmDelete = async () => {
        try {
            await caseService.remove(deleteCaseId);
            await fetchCases(status);
            setDeleteCaseId(null);
            setMessage("Case deleted successfully");
            setMessageType("success");
        } catch (error) {
            console.error(error);
            setMessage("Failed to delete case");
            setMessageType("error");
            setDeleteCaseId(null);
        }
    }

    const badgeColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            case "assigned":
                return "bg-blue-100 text-blue-700";
            case "in_progress":
                return "bg-indigo-100 text-indigo-700";
            case "completed":
                return "bg-green-100 text-green-700";
            case "closed":
                return "bg-gray-200 text-gray-700";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold">Cases</h1>
                    <p className="text-gray-500 mt-1">View all legal cases.</p>
                </div>

                <select value={status} onChange={(e) => setStatus(e.target.value)}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black" >
                    <option value="all">All Cases</option>
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="closed">Closed</option>
                </select>
            </div>
            <DataTables name="view-cases-page" loading={loading} columns={columns} isEmpty={cases.length === 0} emptyMessage="No Case Found!!">
                {cases.map(item => (
                    <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                        <td className="p-4">
                            <div className="font-semibold">
                                {item.title}
                            </div>
                            <div className="text-sm text-gray-500">
                                {item.caseType}
                            </div>
                        </td>

                        <td className="p-4">
                            {item.client?.fullName}
                        </td>

                        <td className="p-4">
                            {item.lawyer?.fullName || (
                                <span className="text-red-500">Not Assigned</span>
                            )}
                        </td>

                        <td className="p-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeColor(item.status)}`}>
                                {item.status.replaceAll("_", " ")}
                            </span>
                        </td>

                        {(user?.role === "admin" || user?.role === "client") && (
                            <td className="p-4">
                                <button onClick={() => handleDelete(item.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
                                    Delete
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
            </DataTables>
            {message && (<MessageModal message={message} type={messageType}
                onClose={() => { setMessage(""), setDeleteCaseId(null) }}
                onConfirm={handleConfirmDelete} confirmText="Delete" />)}
        </div>
    );
}

export default ViewCase;