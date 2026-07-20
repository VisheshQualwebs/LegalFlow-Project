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


import { useEffect, useState } from "react";

function useAuth() {

    const [user, setUser] = useState(null);


    useEffect(() => {

        const storedUser = localStorage.getItem("user");

        if(storedUser && storedUser !== "undefined"){
            setUser(JSON.parse(storedUser));
        }

    }, []);


    return {
        user
    };
}

export default useAuth;


// import { useState } from "react";

// const useAuth = () => {

//     const [user, setUser] = useState(() => {
//         const storedUser = localStorage.getItem("user");

//         if (!storedUser || storedUser === "undefined") {
//             return null;
//         }

//         try {
//             return JSON.parse(storedUser);
//         } catch {
//             return null;
//         }
//     });


//     return {
//         user,
//         setUser
//     };
// };


// export default useAuth;


// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";


// const useAuth = ()=>{
//     return useContext(AuthContext);
// }


// export default useAuth;