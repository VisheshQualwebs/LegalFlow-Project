import { Navigate, Route, Routes } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoutes from "./ProtectedRoutes";
import { routeConfig } from "./routeConfig";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

function AppRoutes() {
    const { user } = useAuth();
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Route>

            <Route
                element={
                    <ProtectedRoutes allowedRole={user?.role}>
                        <DashboardLayout />
                    </ProtectedRoutes>
                }
            >
                {user &&
                    routeConfig[user.role].map((route) => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={route.element}
                        />
                    ))}
            </Route>
        </Routes>
    )
}

export default AppRoutes;