import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    username: "",
    token: "",
    id: "",
    inLobby: false,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const user = action.payload;
      if (!user) {
        state.user = null;
        return;
      }
      console.log("setting user", user);
      state.user = user;
    },

    logout: (state, action) => {
      state.user = null;
    },

    setInLobby: (state, action) => {
      state.user.inLobby = true;
    },
  },
});

export const { login, logout, setInLobby } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state) => state.auth.user;
