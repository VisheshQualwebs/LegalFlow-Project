import { useEffect, useState } from "react";
import caseService from "../services/caseService";
import useAuth from "../hooks/useAuth";

const UpcomingHearingsPage = () => {
    const { user } = useAuth();
    const [hearings, setHearings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("UpcomingHearingsPage MOUNT");
        if(!user?.id) return;
        const load = async () => {
            try {
                const { data } = await caseService.list();
                const cases = data.data || [];

                const hearings = cases
                    .filter(item => 
                        user.role === "admin" ||
                        user.role === "lawyer"
                            ? (item.lawyerId) === (user.id)
                            : (item.clientId) === (user.id)
                    )
                    .filter(item => item.hearingDate && new Date(item.hearingDate) >= new Date())
                    .sort((a, b) => new Date(a.hearingDate) - new Date(b.hearingDate));

                setHearings(hearings);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) load();
        return () => console.log("UpcomingHearingsPage UNMOUNT");
    }, [user?.id, user?.role]);

    if (loading) return <h2>Loading...</h2>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Upcoming Hearings</h1>

            {!hearings.length ? (
                <p className="text-gray-500">No upcoming hearings</p>
            ) : (
                <div className="space-y-4">
                    {hearings.map(item => (
                        <div key={item.id} className="bg-white rounded-xl shadow p-5 flex justify-between">
                            <div>
                                <h2 className="font-semibold">{item.title}</h2>
                                <p className="text-gray-500">{item.caseType}</p>
                            </div>

                            <div className="text-right">
                                <p className="font-semibold">{item.hearingDate}</p>
                                <p className="text-gray-500">{item.hearingTime}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UpcomingHearingsPage;