import { useState } from "react";

function useAuth() {
    const storedUser = localStorage.getItem("user");
    const user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
    return { user };
}

export default useAuth;