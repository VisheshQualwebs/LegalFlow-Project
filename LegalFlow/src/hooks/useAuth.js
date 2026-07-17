import { useMemo } from "react";

const useAuth = () => {
    let user = null;
    try {
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined") {
            user = JSON.parse(storedUser);
        }
    } catch (error) {
        user = null;
    }

    const token = useMemo(() => localStorage.getItem("token"), []);

    return { user, token };
};

export default useAuth;
