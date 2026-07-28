// import { Navigate } from "react-router-dom";

// function ProtectedRoutes({ children, allowedRole }) {
//     let user = null;

// try {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser && storedUser !== "undefined") {
//         user = JSON.parse(storedUser);
//     }
// } catch (err) {
//     console.error("Invalid user in localStorage:", err);
//     localStorage.removeItem("user");
// }

//     // const token = localStorage.getItem("token");

//     // if (!token) {
//     //     return <Navigate to="/login" replace />;
//     // }

//     if (!user) {
//         return <Navigate to="/login" replace />;
//     }

//     if (user.role !== allowedRole) {
//         return <Navigate to="/login" replace />;
//     }

//     return children;
// }

// export default ProtectedRoutes;

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