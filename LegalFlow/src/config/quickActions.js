const quickActions = {
    admin: [
        { title: "Add Admin", description: "Add a new lawyer", url: "/settings" },
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

export default quickActions;