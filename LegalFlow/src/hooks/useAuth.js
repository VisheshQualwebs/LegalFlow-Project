// import { useMemo } from "react";
// const useAuth = () => {
//     const user = useMemo(() => {
//         const storedUser = localStorage.getItem("user");
//         if (!storedUser || storedUser === "undefined") {
//             return null;
//         }
//         return JSON.parse(storedUser);
//     }, []);
//     const token = useMemo(() => localStorage.getItem("token"), []);
//     return { user, token };
// };

// export default useAuth;

import { useState } from "react";

function useAuth() {
    const [user] = useState(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser || storedUser === "undefined") {
            return null;
        }
        try {
            return JSON.parse(storedUser);
        } catch {
            return null;
        }
    });
    return { user };
}

export default useAuth;