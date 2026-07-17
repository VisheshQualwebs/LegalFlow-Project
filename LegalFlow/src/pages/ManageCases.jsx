import { useEffect, useState } from "react";
import caseService from "../services/caseService";

function ManageCases() {

    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCases();
    }, []);

    const loadCases = async () => {
        try {
            const response = await caseService.list();
            setCases(response.data.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (id, field, value) => {
        setCases((prev) =>
            prev.map((item) => item.id === id ? { ...item, [field]: value, } :item)
        );
    };

    const handleUpdate = async (item) => {
        try {
            await caseService.update(item.id, {
                status: item.status,
                hearingDate: item.hearingDate,
                hearingTime: item.hearingTime,
            });
            alert("Case updated successfully");
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">
                Manage Cases
            </h1>

            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-black text-white">
                        <tr>
                            <th className="p-4">Title</th>
                            <th className="p-4">Client</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Hearing Date</th>
                            <th className="p-4">Hearing Time</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {cases.map((item) => (
                            <tr key={item.id} className="border-b">
                                <td className="p-4"> {item.title} </td>
                                <td className="p-4"> {item.client?.fullName} </td>
                                <td className="p-4">
                                    <select value={item.status} onChange={(e) =>
                                        handleChange(
                                            item.id,
                                            "status",
                                            e.target.value
                                        )
                                    }
                                        className="border rounded p-2"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="assigned">Assigned</option>
                                        <option value="in_progress">Progress</option>
                                        <option value="completed">Completed</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </td>

                                <td className="p-4">
                                    <input type="date" value={item.hearingDate || ""}
                                        onChange={(e) =>
                                            handleChange(
                                                item.id,
                                                "hearingDate",
                                                e.target.value
                                            )
                                        }
                                        className="border rounded p-2"
                                    />
                                </td>

                                <td className="p-4">
                                    <input type="time" value={item.hearingTime || ""}
                                        onChange={(e) =>
                                            handleChange(
                                                item.id,
                                                "hearingTime",
                                                e.target.value
                                            )
                                        }
                                        className="border rounded p-2"
                                    />
                                </td>

                                <td className="p-4">
                                    <button onClick={() => handleUpdate(item)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                        Update
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ManageCases;