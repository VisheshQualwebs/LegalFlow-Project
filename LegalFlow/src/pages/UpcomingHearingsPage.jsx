import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "boneyard-js/react";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import caseService from "../services/caseService";

const UpcomingHearingsPage = () => {
    const { user } = useAuth();

    const { data: hearings = [], isLoading: loading } = useQuery({
        queryKey: ["upcoming-hearings", user?.role, user?.id],
        queryFn: async () => {
            const cases = await caseService.list();
            return cases.filter((item) =>
                user?.role === "admin" ? true : user?.role === "lawyer"
                    ? item.lawyerId === user.id : item.clientId === user.id)
                .filter(item => item.hearingDate && new Date(item.hearingDate) >= new Date())
                .sort((a, b) => new Date(a.hearingDate) - new Date(b.hearingDate));
        },
        enabled: !!user?.id,
    })

    return (
        <Skeleton name="assign-lawyer" loading={loading} color="#e5e5e5" darkColor="#444444" animate="shimmer" shimmerColor="#eeeeee" darkShimmerColor="#555555">
            <div>
                <h1 className="text-3xl font-bold mb-6">Upcoming Hearings</h1>
                {hearings.length === 0 ? (
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
        </Skeleton>
    );
};

export default UpcomingHearingsPage;