import { useEffect, useState } from "react";
import DataTables from "../components/DataTables";
import MessageModal from "../components/MessageModal";
import userService from "../services/userService";

function ManageLawyers() {
    const [lawyers, setLawyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const column = [
        { label: "Name" },
        { label: "Email" },
        { label: "Status" },
        { label: "Action" },
    ]

    const loadLawyers = async () => {
        try {
            const response = await userService.list({ role: "lawyer" });
            setLawyers(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLawyers();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            const response = await userService.update(id, { status });
            console.log(response);
            loadLawyers();
            setMessage(`Lawyer status updated to ${status}`);
            setMessageType("success");
        } catch (error) {
            console.error(error);
            setMessage("Failed to update lawyer status");
            setMessageType("error");
        }
    }

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">
                Manage Lawyers
            </h1>
            <DataTables name="manage-lawyer-page" loading={loading} columns={column} isEmpty={lawyers.length === 0} emptyMessage="No Lawyers Found!!">
                {lawyers.map(item => (
                    <tr key={item.email}>
                        <td className="p-4">{item.fullName}</td>
                        <td className="p-4">{item.email}</td>
                        <td className="p-4">{item.status}</td>
                        <td className="p-4 flex gap-8">
                            {item.status === "pending" && (
                                <>
                                    <button onClick={() => updateStatus(item.id, "approved")}
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                        Approve
                                    </button>

                                    <button onClick={() => updateStatus(item.id, "rejected")}
                                        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-green-700">
                                        Reject
                                    </button>
                                </>
                            )}
                            {item.status === "approved" && (
                                <button onClick={() => updateStatus(item.id, "suspended")}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                    Suspend
                                </button>
                            )}
                            {item.status === "suspended" && (
                                <button onClick={() => updateStatus(item.id, "approved")}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                    Activate
                                </button>
                            )}
                            {item.status === "rejected" && (
                                <button onClick={() => updateStatus(item.id, "approved")}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                    Approve
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
            </DataTables>
            {message && (<MessageModal message={message} type={messageType} onClose={() => setMessage("")} />)}
        </div >
    );
};

export default ManageLawyers;