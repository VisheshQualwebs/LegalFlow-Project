import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ProtectedRoutes({ children }) {
    const { user, isAuthenticated } = useAuth();
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

export default ProtectedRoutes;