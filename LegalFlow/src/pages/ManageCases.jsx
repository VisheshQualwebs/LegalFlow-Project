import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import DataTables from "../components/DataTables";
import MessageModal from "../components/MessageModal";
import caseService from "../services/caseService";
import socket from "../utils/socket"

const COLUMN = [
    { label: "Title" },
    { label: "Client" },
    { label: "Status" },
    { label: "Hearing Date" },
    { label: "Hearing Time" },
    { label: "Action" }
]

function ManageCases() {
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [changes, setChanges] = useState({});
    const queryClient = useQueryClient();

    const { data: cases = [], isLoading: loading } = useQuery({
        queryKey: ["cases"],
        queryFn: async () => {
            const resp = await caseService.list();
            return resp || [];
        }
    })

    useEffect(() => {
        if(!cases.length) return;
        cases.forEach((item) => {
            socket.emit("joinCase", item.id);
        });

        const handleCaseUpdated = (updatedCase) => {
            console.log("Real time case update recieved: ", updatedCase);
            queryClient.invalidateQueries({
                queryKey: ["cases"],
            });
        };
        socket.on("case:updated", handleCaseUpdated);
        return () => {
            cases.forEach((item) => {
                socket.emit("leaveCase", item.id);
            })
            socket.off("case:updated", handleCaseUpdated);
        }
    }, [cases, queryClient])

    const updateMutation = useMutation({
        mutationFn: ({id, data}) => caseService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["cases"]
            });
            setMessage("Case update successfully");
            setMessageType("success");
        },
        onError: () => {
            setMessage("Failed to update Case");
            setMessageType("error");
        }
    })

    const handleChange = (id, field, value) => {
        setChanges((prev) =>({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value,
            },
        }));
    };

    const handleUpdate = async (item) => {
        const data = changes[item.id];
        if(!data || Object.keys(data).length === 0) {
            setMessage("No data changes");
            setMessageType("error");
            return;
        }
        updateMutation.mutate({
            id: item.id,
            data,
        })
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Cases</h1>
            <DataTables name="manage-cases-table" loading={loading} columns={COLUMN} isEmpty={cases.length === 0} emptyMessage="No Cases Found">
                {cases.map(item => (
                    <tr>
                        <td className="p-4">{item.title}</td>
                        <td className="p-4">{item.client?.fullName}</td>
                        <td className="p-4">
                            <select value={changes[item.id]?.status ?? item.status ?? ""} onChange={(e) => handleChange(item.id, "status", e.target.value)} className="border rounded p-2">
                                <option value="pending">Pending</option>
                                <option value="assigned">Assigned</option>
                                <option value="in_progress">Progress</option>
                                <option value="completed">Completed</option>
                                <option value="closed">Closed</option>
                            </select>
                        </td>
                        <td className="p-4">
                            <input type="date" value={changes[item.id]?.hearingDate ?? item.hearingDate ?? ""} onChange={e => handleChange(item.id, "hearingDate", e.target.value)} className="border rounded p-2" />
                        </td>
                        <td className="p-4">
                            <input type="time" value={changes[item.id]?.hearingTime ?? item.hearingTime ?? ""} onChange={e => handleChange(item.id, "hearingTime", e.target.value)} className="border rounded p-2" />
                        </td>
                        <td className="p-4">
                            <button onClick={() => handleUpdate(item)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Update</button>
                        </td>
                    </tr>
                ))}
            </DataTables>
            {message && (
                <MessageModal message={message} type={messageType} onClose={() => setMessage("")} />
            )}
        </div>
    );
}

export default ManageCases;