import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
    const user = useSelector((state) => state.auth.user);
    const { t, i18n } = useTranslation();
    if (!user) return null;

    const menus = [
        {
            key: "dashboard",
            url: "/dashboard",
            visible_roles: ["admin", "lawyer", "client"],
        },
        {
            key: "createCase",
            url: "/create-case",
            visible_roles: ["client"],
        },
        {
            key: "clients",
            url: "/clients",
            visible_roles: ["lawyer"],
        },
        {
            key: "myCases",
            url: "/my-cases",
            visible_roles: ["client", "lawyer"],
        },
        {
            key: "manageLawyers",
            url: "/manage-lawyers",
            visible_roles: ["admin"],
        },
        {
            key: "manageCases",
            url: "/manage-cases",
            visible_roles: ["lawyer"],
        },
        {
            key: "upcomingHearings",
            url: "/upcoming-hearings",
            visible_roles: ["lawyer", "client", "admin"],
        },
        {
            key: "viewCases",
            url: "/view-cases",
            visible_roles: ["admin"],
        },
        {
            key: "assignLawyers",
            url: "/assign-lawyers",
            visible_roles: ["admin"],
        },
        {
            key: "document",
            url: "/document",
            visible_roles: ["client", "lawyer"],
        },
        {
            key: "profile",
            url: "/profile",
            visible_roles: ["client", "lawyer", "admin"],
        },
        {
            key: "settings",
            url: "/settings",
            visible_roles: ["admin"],
        },
    ];

    return (
        <div className="w-64 bg-black text-white p-6 min-h-screen">
            <div className="mb-10">
                <Link to="/dashboard" className="text-3xl font-bold">LegalFlow</Link>
            </div>
            <nav className="space-y-7">
                {menus.filter((menu) => menu.visible_roles.includes(user.role)).map((menu) => (
                    <Link key={menu.key} to={menu.url} className="block hover:text-gray-400">
                        {t(`sidebar.${menu.key}`)}
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;