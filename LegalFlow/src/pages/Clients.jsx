import { useEffect, useMemo, useState } from "react";
import caseService from "../services/caseService";

function Clients() {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadClients = async () => {
        try {
            const response = await caseService.lists();
            setCases(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClients();
    }, []);

    const clients = useMemo(() => {
        const map = new Map();

        cases.forEach((item) => {
            if (!item.client) return;

            const id = item.client.id;

            if (!map.has(id)) {
                map.set(id, {
                    ...item.client,
                    totalCases: 1,
                    pendingCases:
                        item.status === "pending"
                            ? 1
                            : 0,
                    completedCases:
                        item.status === "completed" ? 1 : 0,
                });
            } else {
                const client = map.get(id);

                client.totalCases++;

                if (
                    item.status === "pending" 
                ) {
                    client.pendingCases++;
                }

                if (item.status === "completed") {
                    client.completedCases++;
                }
            }
        });

        return [...map.values()];
    }, [cases]);

    return (
        <div className="max-w-7xl mx-auto p-8">

            <div className="mb-8">
                <h1 className="text-4xl font-bold">
                    My Clients
                </h1>

                <p className="text-gray-500 mt-1">
                    Clients assigned to your legal cases.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

                <table className="w-full">

                    <thead className="bg-black text-white">

                        <tr>
                            <th className="p-4 text-left">Client</th>
                            <th className="p-4 text-left">Email</th>
                            <th className="p-4 text-center">Cases</th>
                            <th className="p-4 text-center">Pending</th>
                            <th className="p-4 text-center">Completed</th>
                        </tr>

                    </thead>

                    <tbody>

                        {loading ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center py-10"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : clients.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center py-10 text-gray-500"
                                >
                                    No Clients Found
                                </td>
                            </tr>
                        ) : (
                            clients.map((client) => (
                                <tr
                                    key={client.id}
                                    className="border-b hover:bg-gray-50 transition"
                                >

                                    <td className="p-4">

                                        <div className="font-semibold">
                                            {client.fullName}
                                        </div>

                                    </td>

                                    <td className="p-4">
                                        {client.email}
                                    </td>

                                    <td className="p-4 text-center font-semibold">
                                        {client.totalCases}
                                    </td>

                                    <td className="p-4 text-center">
                                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                                            {client.pendingCases}
                                        </span>
                                    </td>

                                    <td className="p-4 text-center">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                            {client.completedCases}
                                        </span>
                                    </td>

                                </tr>
                            ))
                        )}

                    </tbody>

                </table>

            </div>
        </div>
    );
}

export default Clients;