import { useEffect, useState } from "react";
import caseService from "../services/caseService";
import useAuth from "../hooks/useAuth";

function ViewCase() {
    const [cases, setCases] = useState([]);
    const [status, setStatus] = useState("all");
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchCases = async (selectedStatus = "all") => {
        try {
            const params = selectedStatus === "all" ? {} : { status: selectedStatus };
            const response = await caseService.lists(params);
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
        const confirmDelete = window.confirm("Are you sure you want to delete this case?");

        if(!confirmDelete){
            return;
        }

        try {
            await caseService.remove(id);
            fetchCases(status);
        } catch(error) {
            console.log(error);
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
        <div className="max-w-7xl mx-auto p-8">
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

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-black text-white">
                        <tr>
                            <th className="p-4 text-left">Case</th>
                            <th className="p-4 text-left">Client</th>
                            <th className="p-4 text-left">Lawyer</th>
                            <th className="p-4 text-left">Status</th>
                            {(user?.role === "admin" || user?.role === "client") && (
                                <th className="p-4 text-left">
                                    Action
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-10">Loading...</td>
                            </tr>
                        ) : cases.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-10 text-gray-500">
                                    No Cases Found
                                </td>
                            </tr>
                        ) : (
                            cases.map((item) => (
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

                                    <td className="p-4">
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
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ViewCase;