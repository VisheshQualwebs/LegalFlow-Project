import { useEffect, useMemo, useState } from "react";
import DataTables from "../components/DataTables";
import caseService from "../services/caseService";

function Clients() {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        { label: "Client" },
        { label: "Email" },
        { label: "Cases", className:"text-center" },
        { label: "Pending", className:"text-center" },
        { label: "Completed", className:"text-center" },
    ]

    useEffect(() => {
        caseService.list()
            .then(res => setCases(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const clients = useMemo(() => {
        const map = new Map();
        cases.forEach(({ client, status }) => {
            if (!client) return;
            const data = map.get(client.id) || {
                ...client,
                totalCases: 0,
                pendingCases: 0,
                completedCases: 0
            };
            data.totalCases++;
            if (status === "pending") data.pendingCases++;
            if (status === "completed") data.completedCases++;
            map.set(client.id, data);
        });
        return [...map.values()];
    }, [cases]);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold">My Clients</h1>
                <p className="text-gray-500 mt-1">
                    Clients assigned to your legal cases.
                </p>
            </div>
            <DataTables name="clients-table" loading={loading} columns={columns} isEmpty={clients.length === 0} emptyMessage="No Clients Found">
                {clients.map(item => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-semibold">
                            {item.fullName}
                        </td>
                        <td className="p-4">{item.email}</td>
                        <td className="p-4 text-center font-semibold">
                            {item.totalCases}
                        </td>
                        <td className="p-4 text-center">
                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                                {item.pendingCases}
                            </span>
                        </td>
                        <td className="p-4 text-center">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                {item.completedCases}
                            </span>
                        </td>
                    </tr>
                ))}
            </DataTables>
        </div >
    );
}

export default Clients;

{/* <Skeleton name="clients-table" loading={loading}>
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
                {clients.length === 0 ? (
                    <tr>
                        <td colSpan="5" className="text-center py-10 text-gray-500">
                            No Clients Found
                        </td>
                    </tr>
                ) : (
                    clients.map(client => (
                        <tr key={client.id} className="border-b hover:bg-gray-50">
                            <td className="p-4 font-semibold">
                                {client.fullName}
                            </td>
                            <td className="p-4">{client.email}</td>
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
</Skeleton> */}