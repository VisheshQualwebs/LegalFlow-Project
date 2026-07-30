import { Navigate } from "react-router-dom";

function ProtectedRoutes({ children }) {
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

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoutes;