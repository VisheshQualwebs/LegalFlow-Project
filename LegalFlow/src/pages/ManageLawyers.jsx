import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import DataTables from "../components/DataTables";
import MessageModal from "../components/MessageModal";
import userService from "../services/userService";
import { lawyerColumns } from "../config/column"

function ManageLawyers() {
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [status, setStatus] = useState("all")
    const [sortConfig, setSortConfig] = useState({
        key: null,
        dir: "asc",
    })
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
        updateMutation.mutate({ id, status });
    };

    const filteredLawyers = useMemo(() => {
        if (status === "all") {
            return lawyers;
        }
        return lawyers.filter((lawyer) => lawyer.status === status);
    }, [lawyers, status])

    const sortedLawyers = useMemo(() => {
        if (!sortConfig.key) {
            return filteredLawyers;
        }

        return [...filteredLawyers].sort((a, b) => {
            let valueA, valueB;

            switch (sortConfig.key) {
                case "name":
                    valueA = a.fullName.toLowerCase();
                    valueB = b.fullName.toLowerCase();
                    break;

                case "status":
                    valueA = a.status || "";
                    valueB = b.status || "";
                    break;

                default: return 0;
            }

            const comp = String(valueA).localeCompare(
                String(valueB),
                undefined,
                { sensitivity: "base" }
            )

            return sortConfig.dir === "asc" ? comp : -comp;
        }, [filteredLawyers, sortConfig]);
    })

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold">
                        Manage Lawyers
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <select value={status} onChange={(e) => setStatus(e.target.value)}
                        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black" >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="suspended">Suspended</option>
                    </select>
                    <select value={sortConfig.key} onChange={(e) => {
                        setSortConfig({ key: e.target.value, dir: "asc" })
                    }} className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black">
                        <option value="">Sort By</option>
                        <option value="name">Name</option>
                        <option value="status">Status</option>
                    </select>
                    <select value={sortConfig.dir} onChange={(e) => {
                        setSortConfig(prev => ({ ...prev, dir: e.target.value }))
                    }} className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black ml-4">
                        <option value="asc">A-Z</option>
                        <option value="desc">Z-A</option>
                    </select>
                </div>
            </div>
            <DataTables name="manage-lawyer-page" loading={loading} columns={lawyerColumns} isEmpty={lawyers.length === 0} emptyMessage="No Lawyers Found!!">
                {sortedLawyers.map(item => (
                    <tr key={item.email}>
                        <td className="p-4">{item.fullName}</td>
                        <td className="p-4">{item.email}</td>
                        <td className="p-4">{item.status}</td>
                        <td className="p-4 flex gap-8  justify-center items-center">
                            {item.status === "pending" && (
                                <>
                                    <button onClick={() => updateStatus(item.id, "approved")}
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                        Approve
                                    </button>

                                    <button onClick={() => updateStatus(item.id, "rejected")}
                                        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
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