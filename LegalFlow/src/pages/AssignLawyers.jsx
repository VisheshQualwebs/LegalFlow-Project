import { useEffect, useState } from "react";
import DataTables from "../components/DataTables";
import MessageModal from "../components/MessageModal";
import caseService from "../services/caseService";
import userService from "../services/userService";

const AssignLawyers = () => {
    const [loading, setLoading] = useState(true);
    const [cases, setCases] = useState([]);
    const [lawyers, setLawyers] = useState([]);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const column = [
        { label: "Case" },
        { label: "Client" },
        { label: "Lawyer" },
        { label: "Status" }
    ]

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const caseResponse = await caseService.list();
            const userResponse = await userService.list();
            setCases(caseResponse.data.data.filter(item => !item.lawyerId));
            setLawyers(userResponse.data.data.filter(user => user.role === "lawyer" && user.status === "approved"));
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (caseId, lawyerId) => {
        if (!lawyerId) return;
        try {
            await caseService.update(caseId, { lawyerId });
            loadData();
            setMessage("Lawyer assigned successfully");
            setMessageType("success");
        } catch (error) {
            console.error(error);
            setMessage("Failed to assign lawyer");
            setMessageType("error");
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">
                Assign Lawyers
            </h1>
            <DataTables name="assign-lawyer" loading={loading} columns={column} isEmpty={cases.length === 0} emptyMessage="No Cases Found to Assign to Lawyers">
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