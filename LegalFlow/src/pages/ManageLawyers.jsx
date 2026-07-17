import { useEffect, useState } from "react";
import userService from "../services/userService";

function ManageLawyers() {

    const [lawyers, setLawyers] = useState([]);

    const loadLawyers = async () => {
        try {
            const response = await userService.list({ role: "lawyer" });
            setLawyers(response.data.data);
        } catch (error) {
            console.error(error);
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
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="max-w-7xl mx-auto p-8">
            <h1 className="text-4xl font-bold mb-8">
                Manage Lawyers
            </h1>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-black text-white">
                        <tr>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Email</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {lawyers.length > 0 ? (
                            lawyers.map((lawyer) => (
                                <tr key={lawyer.email} className="border-b">
                                    <td className="p-4">{lawyer.fullName}</td>
                                    <td className="p-4">{lawyer.email}</td>
                                    <td className="p-4">{lawyer.status}</td>
                                    <td className="p-4 flex gap-8">
                                        {lawyer.status === "pending" && (
                                            <>
                                                <button onClick={() => updateStatus(lawyer.id, "approved")}
                                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                                    Approve
                                                </button>

                                                <button onClick={() => updateStatus(lawyer.id, "rejected")}
                                                    className="bg-red-600 text-white px-6 py-2 rounded hover:bg-green-700">
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {lawyer.status === "approved" && (
                                            <button onClick={() => updateStatus(lawyer.id, "suspended")}
                                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                                Suspend
                                            </button>
                                        )}
                                        {lawyer.status === "suspended" && (
                                            <button onClick={() => updateStatus(lawyer.id, "approved")}
                                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                                Activate
                                            </button>
                                        )}
                                        {lawyer.status === "rejected" && (
                                            <button onClick={() => updateStatus(lawyer.id, "approved")}
                                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                                Approve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center p-8">No Lawyers Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageLawyers;