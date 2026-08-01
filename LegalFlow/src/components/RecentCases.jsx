import { Link } from "react-router-dom";

const RecentCases = ({ cases = [], viewUrl }) => {
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between mb-6">
                <h2 className="text-xl font-semibold">
                    Recent Cases
                </h2>

                <Link to={viewUrl} className="text-sm text-blue-600 hover:underline">
                    View All
                </Link>
            </div>

            {cases.length ? (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3">Case</th>
                                <th className="text-left py-3">Client</th>
                                <th className="text-left py-3">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {cases.map((item) => (
                                <tr key={item.id} className="border-b">
                                    <td className="py-4 font-medium">
                                        {item.title}
                                    </td>

                                    <td className="py-4 text-gray-600">
                                        {item.client}
                                    </td>

                                    <td className="py-4">
                                        <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center py-10 text-gray-500">
                    No recent cases
                </p>
            )}
        </div>
    );
};

export default RecentCases;