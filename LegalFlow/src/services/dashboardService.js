import caseService from "./caseService";
import userService from "./userService";

const getDashboard = async (role = "client") => {
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

        const stats = {
            totalCases: normalizedCases.length,
            pendingCases: normalizedCases.filter((item) => item.status === "pending").length,
            assignedCases: normalizedCases.filter((item) => item.status === "assigned").length,
            completedCases: normalizedCases.filter((item) => item.status === "completed").length,
            myCases: normalizedCases.length,
            totalLawyers: users.filter((item) => item.role === "lawyer").length,
            totalClients: users.filter((item) => item.role === "client").length,
        };

        if (role === "lawyer") {
            const lawyerCases = normalizedCases.filter((item) => item.lawyer?.id || item.lawyerId);
            stats.assignedCases = lawyerCases.filter((item) => item.status === "assigned").length;
            stats.completedCases = lawyerCases.filter((item) => item.status === "completed").length;
            stats.myCases = lawyerCases.length;
        }

        if (role === "client") {
            const clientCases = normalizedCases.filter((item) => item.client?.id || item.clientId);
            stats.myCases = clientCases.length;
            stats.pendingCases = clientCases.filter((item) => item.status === "pending").length;
        }

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
                completedCases: 0,
                myCases: 0,
            },
        };
    }
};

export default { getDashboard, };
