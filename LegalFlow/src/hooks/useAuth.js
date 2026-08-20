import { useSelector } from "react-redux";

function useAuth() {
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    return { user, token, isAuthenticated };
}

export default useAuth;