import { useEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard";
import StatusBar from "../components/StatusBar";
import UpcomingHearings from "../components/UpcomingHearings";
import RecentCases from "../components/RecentCases";
import QuickActions from "../components/QuickActions";
import dashboardConfig from "../services/dashboardConfig";
import dashboardService from "../services/dashboardService";
import useAuth from "../hooks/useAuth";

const UserDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.role) return;
        const loadDashboard = async () => {
            try {
                const response = await dashboardService.getDashboard(user.role, user.id);
                setStats(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, [user?.role, user?.id]);

    if (loading) return <h2>Loading dashboard...</h2>;
    if (!user) return null;

    const isAdmin = user.role === "admin";
    const hearingViewUrl = "/upcoming-hearings";
    const recentCasesViewUrl = isAdmin ? "/view-cases" : "/my-cases";

    const quickActions = {
        admin: [
            { title: "Add Lawyer", description: "Add a new lawyer", url: "/settings" },
            { title: "View Cases", description: "Manage all cases", url: "/view-cases" },
            { title: "Assign Lawyer", description: "Assign lawyer to case", url: "/assign-lawyers" },
        ],

        lawyer: [
            { title: "My Cases", description: "Manage assigned cases", url: "/my-cases" },
            { title: "Clients", description: "View your clients", url: "/clients" },
            { title: "Documents", description: "Manage case documents", url: "/documents" },
        ],

        client: [
            { title: "Create Case", description: "Start a new legal case", url: "/create-case" },
            { title: "My Cases", description: "Track your cases", url: "/my-cases" },
            { title: "Documents", description: "View your documents", url: "/document" },
        ],
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {(dashboardConfig[user.role] || []).map(card => (
                    <DashboardCard key={card.key} title={card.title} value={stats[card.key] ?? 0} />
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-6">{isAdmin ? "Case Overview" : "My Case Overview"}</h2>
                    <div className="space-y-5">
                        <StatusBar label="Pending" value={stats.pendingCases} total={stats.totalCases} />
                        <StatusBar label="Assigned" value={stats.assignedCases} total={stats.totalCases} />
                        <StatusBar label="In Progress" value={stats.inProgressCases} total={stats.totalCases} />
                        <StatusBar label="Completed" value={stats.completedCases} total={stats.totalCases} />
                    </div>
                </div>

                <UpcomingHearings hearings={stats.upcomingHearings} viewUrl={hearingViewUrl} />
            </div>

            <div className="mt-6">
                <RecentCases cases={stats.recentCases} viewUrl={recentCasesViewUrl} />
            </div>

            <div className="mt-6">
                <QuickActions actions={quickActions[user.role] || []} />
            </div>
        </div>
    );
};

export default UserDashboard;