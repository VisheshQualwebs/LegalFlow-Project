import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Home from "../pages/Home";
import ProtectedRoutes from "./ProtectedRoutes";
import { routeConfig } from "./routeConfig";

function AppRoutes() {
    const user = useSelector((state) => state.auth.user);
    return (
        <Routes>
            <Route path="/" element={<Home />} />
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
                {user &&
                    routeConfig[user?.role].map((route) => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={route.element}
                        />
                    ))
                }

                {/* {[...routeConfig.admin,
                ...routeConfig.lawyer,
                ...routeConfig.client,
                ].filter((route, index, self) =>
                    self.findIndex((r) => r.path === route.path) === index
                ).map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                ))} */}
            </Route>
        </Routes>
    )
}

export default AppRoutes;