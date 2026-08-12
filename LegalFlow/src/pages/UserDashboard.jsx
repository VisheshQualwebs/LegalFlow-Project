import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "boneyard-js/react";
import DashboardCard from "../components/DashboardCard";
import QuickActions from "../components/QuickActions";
import RecentCases from "../components/RecentCases";
import StatusBar from "../components/StatusBar";
import UpcomingHearings from "../components/UpcomingHearings";
import useAuth from "../hooks/useAuth";
import dashboardConfig from "../config/dashboardConfig";
import dashboardService from "../services/dashboardService";
import socket from "../utils/socket";
import { useEffect } from "react";
import quickActions from "../config/quickActions";

const UserDashboard = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: stats = {}, isLoading: loading, isError, error } = useQuery({
        queryKey: ["dashboard", user?.role, user?.id],
        queryFn: async () => {
            const resp = await dashboardService.getDashboard(user.role, user.id);
            return resp.data;
        },
        enabled: !!user?.role && !!user?.id,
    })

    useEffect(() => {
        if (!user) return;
        const handleUpdate = () => {
            queryClient.invalidateQueries({
                queryKey: ["dashboard", user?.role, user?.id],
            })
        };
        socket.on("dashboardUpdate", handleUpdate);
        return () => {
            socket.off("dashboardUpdate", handleUpdate);
        };
    }, [queryClient, user?.role, user?.id]);

    if (!user) return null;

    if (isError) {
        return (
            <p className="text-red-500">{error?.message || "Failed to load dashboard"}</p>
        )
    }
    const isAdmin = user.role === "admin";

    return (
        <Skeleton name="user-dashboard" loading={loading} color="#e5e5e5" darkColor="#444444" animate="shimmer" shimmerColor="#eeeeee" darkShimmerColor="#555555">
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

                    <UpcomingHearings hearings={stats.upcomingHearings} viewUrl="/upcoming-hearings" />
                </div>

                <div className="mt-6">
                    <RecentCases cases={stats.recentCases} viewUrl={isAdmin ? "/view-cases" : "/my-cases"} />
                </div>

                <div className="mt-6">
                    <QuickActions actions={quickActions[user.role]} />
                </div>
            </div>
        </Skeleton>
    );
};

export default UserDashboard;