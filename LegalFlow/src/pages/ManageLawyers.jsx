import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import DataTables from "../components/DataTables";
import MessageModal from "../components/MessageModal";
import userService from "../services/userService";

const COLUMN = [
    { label: "Name" },
    { label: "Email" },
    { label: "Status" },
    { label: "Action" },
]

function ManageLawyers() {
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const queryClient = useQueryClient();

    const { data: lawyers = [], isLoading: loading } = useQuery({
        queryKey: ["lawyers"],
        queryFn: async () => {
            const resp = await userService.list({ role: "lawyer" });
            return resp.data.data;
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            return userService.update(id, { status });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["lawyers"],
            })
            setMessage(`Lawyer status updated to ${variables.status}`);
            setMessageType("success");
        },
        onError: () => {
            setMessage("Failed to update lawyer status");
            setMessageType("error");
        }
    });

    const updateStatus = (id, status) => {
        updateMutation.mutate({id, status});
    };

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">
                Manage Lawyers
            </h1>
            <DataTables name="manage-lawyer-page" loading={loading} columns={COLUMN} isEmpty={lawyers.length === 0} emptyMessage="No Lawyers Found!!">
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