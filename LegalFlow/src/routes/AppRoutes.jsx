import { Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ProtectedRoutes from "./ProtectedRoutes";
import { routeConfig } from "./routeConfig";

function AppRoutes() {
    let user = null;

    try {
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined") {
            user = JSON.parse(storedUser);
        }
    } catch (err) {
        console.error("Invalid user in localStorage:", err);
        localStorage.removeItem("user");
    }
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Route>

            <Route path="/"
                element={
                    <ProtectedRoutes allowedRole={user?.role}>
                        <DashboardLayout />
                    </ProtectedRoutes>
                }>
                {/* {user &&
                    routeConfig[user?.role].map((route) => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={route.element}
                        />
                    ))
                } */}

                {[...routeConfig.admin,
                ...routeConfig.lawyer,
                ...routeConfig.client,
                ].filter((route, index, self) =>
                    self.findIndex((r) => r.path === route.path) === index
                ).map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                ))}
            </Route>
        </Routes>
    )
}

export default AppRoutes;