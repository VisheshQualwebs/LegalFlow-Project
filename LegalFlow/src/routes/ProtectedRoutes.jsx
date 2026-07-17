import { Navigate } from "react-router-dom";

function ProtectedRoutes({ children, allowedRole }) {
    const user = JSON.parse(localStorage.getItem("user"));

    // const token = localStorage.getItem("token");

    // if (!token) {
    //     return <Navigate to="/login" replace />;
    // }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== allowedRole) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoutes;