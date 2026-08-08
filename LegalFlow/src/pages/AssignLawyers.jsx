import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import DataTables from "../components/DataTables";
import MessageModal from "../components/MessageModal";
import caseService from "../services/caseService";
import userService from "../services/userService";

const COLUMN = [
    { label: "Case" },
    { label: "Client" },
    { label: "Lawyer" },
    { label: "Status" }
]

const AssignLawyers = () => {
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const queryClient = useQueryClient();

    const { data: cases = [], isLoading: casesLoading } = useQuery({
        queryKey: ["unassigned-cases"],
        queryFn: async () => {
            const resp = await caseService.list();
            return (resp.data.data || []).filter(item => !item.lawyerId);
        },
    });

    const { data: lawyers = [], isLoading: lawyersLoading } = useQuery({
        queryKey: ["approved-lawyers"],
        queryFn: async () => {
            const resp = await userService.list();
            return (resp.data.data || []).filter(user => user.role === "lawyer" && user.status === "approved");
        },
    });

    const assignMutation = useMutation({
        mutationFn: ({ caseId, lawyerId }) => caseService.update(caseId, { lawyerId }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["unassigned-cases"],
            })
            queryClient.invalidateQueries({
                queryKey: ["cases"],
            })
            setMessage("Lawyer Assigned Successfully");
            setMessageType("success");
        },
        onError: () => {
            setMessage("Failed to assign lawyer");
            setMessageType("error");
        }
    })

    const handleAssign = async (caseId, lawyerId) => {
        if (!lawyerId) return;
        assignMutation.mutate({ caseId, lawyerId });
    };

    const loading = lawyersLoading || casesLoading;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">
                Assign Lawyers
            </h1>
            <DataTables name="assign-lawyer" loading={loading} columns={COLUMN} isEmpty={cases.length === 0} emptyMessage="No Cases Found to Assign to Lawyers">
                {cases.map(item => (
                    <tr key={item.id}>
                        <td className="p-4">{item.title}</td>
                        <td className="p-4">{item.client.fullName}</td>
                        <td className="p-4">
                            <select defaultValue="" onChange={(e) => handleAssign(item.id, e.target.value)} className="border p-2 rounded">
                                <option value="">Select Lawyer</option>
                                {lawyers.map(lawyer => (
                                    <option key={lawyer.id} value={lawyer.id}>{lawyer.fullName}</option>
                                ))}
                            </select>
                        </td>
                        <td className="p-4">{item.status}</td>
                    </tr>
                ))}
            </DataTables>
            {message && (<MessageModal message={message} type={messageType} onClose={() => setMessage("")} />)}
        </div>
    );
};

export default AssignLawyers;