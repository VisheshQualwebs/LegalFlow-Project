import { Link } from "react-router-dom";

const UpcomingHearings = ({ hearings = [], viewUrl }) => {
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between mb-6">
                <h2 className="text-xl font-semibold">
                    Upcoming Hearings
                </h2>

                <Link to={viewUrl} className="text-sm text-blue-600 hover:underline">
                    View All
                </Link>
            </div>

            {hearings.length ? (
                <div className="space-y-4">
                    {hearings.map((hearing) => (
                        <div key={hearing.id} className="border rounded-lg p-4 flex justify-between">
                            <div>
                                <h3 className="font-semibold">{hearing.title}</h3>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">{hearing.hearingDate}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center py-10 text-gray-500">
                    No upcoming hearings
                </p>
            )}
        </div>
    );
};

export default UpcomingHearings;