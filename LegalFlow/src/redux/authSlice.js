import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

let parsedUser = null;

try {
    if (storedUser && storedUser !== undefined) {
        parsedUser = JSON.parse(storedUser);
    }
} catch (error) {
    console.log("Invalid user in localstorage", error);
    localStorage.removeItem("user");
}

const initialState = { user: parsedUser, token: storedToken || null, isAuthenticated: !!parsedUser && !!storedToken };

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);
        },
        
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = true;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        }
    }
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;