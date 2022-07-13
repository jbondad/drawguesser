import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {
        username: "",
        token: "",
    }
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers: {
        login: (state, action) => {
            const user = action.payload;
            if(!user) {
                state.user = null;
                return;
            }
            console.log("setting user", user);
            state.user = user;
        },

        logout: (state, action) =>{
            state.user = null;
        } 


    }
})

export const { login, logout } = authSlice.actions;
export default authSlice.reducer
export const selectCurrentUser = (state) => state.auth.user;


