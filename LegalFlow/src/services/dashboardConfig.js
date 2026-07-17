const dashboardConfig = {
    admin: [
        { title: "Total Cases", key: "totalCases" },
        { title: "Lawyers", key: "totalLawyers" },
        { title: "Clients", key: "totalClients" }
    ],

    lawyer: [
        { title: "Total Cases", key: "totalCases" },
        { title: "Assigned Cases", key: "assignedCases" },
        { title: "Completed Cases", key: "completedCases" },
    ],

    client: [
        { title: "Total Cases", key: "totalCases" },
        { title: "My Cases", key: "myCases" },
        { title: "Pending Cases", key: "pendingCases" },
    ]
};

export default dashboardConfig;