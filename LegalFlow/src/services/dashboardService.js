import caseService from "./caseService";
import userService from "./userService";

const getDashboard = async (role = "client", userId) => {
    try {
        const [casesResponse, usersResponse] = await Promise.all([
            caseService.list(),
            role === "admin" ? userService.list() : Promise.resolve({ data: [] }),
        ]);

        const cases = casesResponse.data.data || [];
        const users = usersResponse.data.data || [];

        const normalizedCases = cases.map((item) => ({
            ...item,
            status: (item.status || "pending").toLowerCase(),
        }));

        let roleCases = normalizedCases;

        if (role === "lawyer") {
            roleCases = normalizedCases.filter((item) => Number(item.lawyerId) === Number(userId));
        }

        if (role === "client") {
            roleCases = normalizedCases.filter((item) => Number(item.clientId) === Number(userId));
        }

        const stats = {
            totalCases: roleCases.length,
            pendingCases: roleCases.filter((item) => item.status === "pending").length,
            assignedCases: roleCases.filter((item) => item.status === "assigned").length,
            inProgressCases: roleCases.filter((item) => item.status === "in_progress").length,
            completedCases: roleCases.filter((item) => item.status === "completed").length,
            myCases: roleCases.length,
            totalLawyers: users.filter((item) => item.role === "lawyer").length,
            totalClients: users.filter((item) => item.role === "client").length,
            activeCases: roleCases.filter((item) => ["assigned", "in_progress"].includes(item.status)).length,
            recentCases: [...roleCases]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map((item) => ({
                    id: item.id,
                    title: item.title,
                    client: item.client?.fullName || "Unknown",
                    status: item.status,
                })),

            upcomingHearings: roleCases
                .filter((item) => item.hearingDate && new Date(item.hearingDate) >= new Date())
                .sort((a, b) => new Date(a.hearingDate) - new Date(b.hearingDate))
                .slice(0, 5),
        };

        stats.upcomingHearingsCount = stats.upcomingHearings.length;

        if (role !== "admin") {
            delete stats.totalLawyers;
            delete stats.totalClients;
        }

        return { data: stats };
    } catch (error) {
        console.error(error);
        return {
            data: {
                totalCases: 0,
                pendingCases: 0,
                assignedCases: 0,
                inProgressCases: 0,
                completedCases: 0,
                myCases: 0,
                recentCases: [],
                upcomingHearings: [],
                upcomingHearingsCount: 0,
            },
        };
    }
};

export default { getDashboard, };
