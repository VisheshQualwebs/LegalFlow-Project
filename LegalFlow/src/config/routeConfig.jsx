import AssignLawyers from "../pages/AssignLawyers";
import Clients from "../pages/Clients";
import CreateCase from "../pages/CreateCase";
import Documents from "../pages/Documents";
import ManageCases from "../pages/ManageCases";
import ManageLawyers from "../pages/ManageLawyers";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import UpcomingHearingsPage from "../pages/UpcomingHearingsPage";
import Dashboard from "../pages/UserDashboard";
import ViewCase from "../pages/ViewCase";

export const routeConfig = {

    admin: [
        { path: "dashboard", element: <Dashboard /> },
        { path: "manage-lawyers", element: <ManageLawyers /> },
        { path: "view-cases", element: <ViewCase /> },
        { path: "settings", element: <Settings /> },
        { path: "assign-lawyers", element: <AssignLawyers /> },
        { path: "profile", element: <Profile /> },
        { path: "upcoming-hearings", element: <UpcomingHearingsPage /> }
    ],

    lawyer: [
        { path: "dashboard", element: <Dashboard /> },
        { path: "my-cases", element: <ViewCase /> },
        { path: "clients", element: <Clients /> },
        { path: "profile", element: <Profile /> },
        { path: "document", element: <Documents /> },
        { path: "manage-cases", element: <ManageCases /> },
        { path: "upcoming-hearings", element: <UpcomingHearingsPage /> }
    ],

    client: [
        { path: "dashboard", element: <Dashboard /> },
        { path: "my-cases", element: <ViewCase /> },
        { path: "create-case", element: <CreateCase /> },
        { path: "document", element: <Documents /> },
        { path: "profile", element: <Profile /> },
        { path: "upcoming-hearings", element: <UpcomingHearingsPage /> }
    ]
};