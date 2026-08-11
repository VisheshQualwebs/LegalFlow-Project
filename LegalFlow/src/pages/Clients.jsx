import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import DataTables from "../components/DataTables";
import caseService from "../services/caseService";

const COLUMN = [
    { label: "Client" },
    { label: "Email" },
    { label: "Cases", className: "text-center" },
    { label: "Pending", className: "text-center" },
    { label: "Completed", className: "text-center" },
]

function Clients() {
    const { data: cases = [], isLoading: loading, isError, error } = useQuery({
        queryKey: ["cases", { view: "clients" }],
        queryFn: async () => {
            const resp = await caseService.list();
            return resp || [];
        }
    })

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

    if (isError) {
        return (
            <div className="text-center py-10 text-gray-500">
                {error?.message || "Failed to load clients"}
            </div>
        )
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold">My Clients</h1>
                <p className="text-gray-500 mt-1">
                    Clients assigned to your legal cases.
                </p>
            </div>
            <DataTables name="clients-table" loading={loading} columns={COLUMN} isEmpty={clients.length === 0} emptyMessage="No Clients Found">
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