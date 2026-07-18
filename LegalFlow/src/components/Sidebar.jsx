import { Link } from "react-router-dom";

const Sidebar = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return null;

    const menus = [
        {
            title: "Dashboard",
            url: "/dashboard",
            visible_roles: ["admin", "lawyer", "client"],
        },
        {
            title: "Create Case",
            url: "/create-case",
            visible_roles: ["client"],
        },
        {
            title: "Clients",
            url: "/clients",
            visible_roles: ["lawyer"],
        },
        {
            title: "My Cases",
            url: "/my-cases",
            visible_roles: ["client", "lawyer"],
        },
        {
            title: "Manage Lawyers",
            url: "/manage-lawyers",
            visible_roles: ["admin"],
        },
        {
            title: "Manage Cases",
            url: "/manage-cases",
            visible_roles: ["lawyer"],
        },
        {
            title: "View Cases",
            url: "/view-cases",
            visible_roles: ["admin"],
        },
        {
            title: "Assign Lawyers",
            url: "/assign-lawyers",
            visible_roles: ["admin"],
        },
        {
            title: "Document",
            url: "/document",
            visible_roles: ["client", "lawyer"],
        },
        {
            title: "Profile",
            url: "/profile",
            visible_roles: ["client", "lawyer"],
        },
        {
            title: "Reports",
            url: "/reports",
            visible_roles: ["admin"],
        },
        {
            title: "Settings",
            url: "/settings",
            visible_roles: ["admin"],
        },
    ];

    return (
        <div className="w-64 bg-black text-white p-6 min-h-screen">
            <h2 className="text-3xl font-bold mb-10">
                LegalFlow
            </h2>

            <nav className="space-y-5">
                {menus.filter((menu) =>
                    menu.visible_roles.includes(user.role)
                ).map((menu) => (
                    <Link key={menu.title} to={menu.url} className="block hover:text-gray-400">
                        {menu.title}
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;