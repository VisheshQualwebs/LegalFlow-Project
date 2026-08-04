import { useEffect, useState } from "react";
import caseService from "../services/caseService";
import userService from "../services/userService";
import { Skeleton } from "boneyard-js/react";
import MessageModal from "../components/MessageModal";

const AssignLawyers = () => {
    const [loading, setLoading] = useState(true);
    const [cases, setCases] = useState([]);
    const [lawyers, setLawyers] = useState([]);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

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
        <Skeleton name="assign-lawyer" loading={loading}>
            <div>
                <h1 className="text-3xl font-bold mb-6">
                    Assign Lawyers
                </h1>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <table className="w-full bg-white shadow">
                        <thead className="bg-black text-white">
                            <tr>
                                <th className="p-3">Case</th>
                                <th className="p-3">Client</th>
                                <th className="p-3">Lawyer</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>

                        <tbody className="text-center">
                            {cases.length > 0 ? (
                                cases.map(item => (
                                    <tr key={item.id}>
                                        <td className="p-3 break-words">{item.title}</td>
                                        <td className="p-3">{item.client.fullName}</td>
                                        <td className="p-3">
                                            <select defaultValue="" onChange={(e) => handleAssign(item.id, e.target.value)} className="border p-2 rounded">
                                                <option value="">
                                                    Select Lawyer
                                                </option>
                                                {lawyers.map(lawyer => (
                                                    <option key={lawyer.id} value={lawyer.id}>
                                                        {lawyer.fullName}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-3">Pending</td>
                                    </tr>
                                ))) : (
                                <tr>
                                    <td colSpan={4} className="p-6 text-gray-500 text-center italic">
                                        No cases found to assign.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        {message && (<MessageModal message={message} type={messageType} onClose={() => setMessage("")} />)}
                    </table>
                </div>
            </div>
        </Skeleton>
    );
};

export default AssignLawyers;