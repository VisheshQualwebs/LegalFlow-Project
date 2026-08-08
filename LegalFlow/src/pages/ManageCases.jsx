import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import DataTables from "../components/DataTables";
import MessageModal from "../components/MessageModal";
import caseService from "../services/caseService";


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
    const queryClient = useQueryClient();

    const { data: cases = [], isLoading: loading } = useQuery({
        queryKey: ["cases"],
        queryFn: async () => {
            const resp = await caseService.list();
            return resp.data.data || [];
        }
    })

    const updateMutation = useMutation({
        mutationFn: (id, data) => caseService.update(id, data),
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
    const handleChange = (item) => {
        setCases(prev => prev.map(
            item => item.id === id ? { ...item, [field]: value } : item
        ));
    }

    const handleUpdate = async (item) => {
        updateMutation.mutate({
            id: item.id,
            data: {
                [field]: value,
            }
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
                            <select value={item.status} onChange={(e) => handleChange(item.id, "status", e.target.value)} className="border rounded p-2">
                                <option value="pending">Pending</option>
                                <option value="assigned">Assigned</option>
                                <option value="in_progress">Progress</option>
                                <option value="completed">Completed</option>
                                <option value="closed">Closed</option>
                            </select>
                        </td>
                        <td className="p-4">
                            <input type="date" value={item.hearingDate || ""} onChange={e => handleChange(item.id, "hearingDate", e.target.value)} className="border rounded p-2" />
                        </td>
                        <td className="p-4">
                            <input type="time" value={item.hearingTime || ""} onChange={e => handleChange(item.id, "hearingTime", e.target.value)} className="border rounded p-2" />
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