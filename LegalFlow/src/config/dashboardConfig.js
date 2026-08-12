const dashboardConfig = {
    admin: [
        { title: "Total Cases", key: "totalCases" },
        { title: "Active Cases", key: "activeCases" },
        { title: "Lawyers", key: "totalLawyers" },
        { title: "Clients", key: "totalClients" }
    ],

    lawyer: [
        { title: "My Cases", key: "totalCases" },
        { title: "Active Cases", key: "activeCases" },
        { title: "Assigned Cases", key: "assignedCases" },
        { title: "Completed Cases", key: "completedCases" },
    ],

    client: [
        { title: "My Cases", key: "totalCases" },
        { title: "Active Cases", key: "activeCases" },
        { title: "Pending Cases", key: "pendingCases" },
        { title: "Upcoming Hearings", key: "upcomingHearingsCount" },
    ]
};

export default dashboardConfig;