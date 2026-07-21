import { useEffect, useState } from "react";

import DashboardCard from "../components/DashboardCard";
import dashboardConfig from "../services/dashboardConfig";
import useAuth from "../hooks/useAuth";
import dashboardService from "../services/dashboardService";

const UserDashboard = () => {

    const { user } = useAuth();

    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const response = await dashboardService.getDashboard(user.role);
                setStats(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, [user?.role]);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <>
            <h1 className="text-3xl font-bold mb-6">
                Dashboard
            </h1>

            <div className="grid grid-cols-4 gap-6">
                {(dashboardConfig[user.role] || []).map((card) => (
                    <DashboardCard
                        key={card.key}
                        title={card.title}
                        value={stats[card.key] ?? 0}
                    />
                ))}
            </div>
        </>
    );
};

export default UserDashboard;