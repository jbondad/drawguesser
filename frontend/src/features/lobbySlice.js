import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    roomCode: "",
    playerList: [],
    messageList: [],
    gameState: "lobby",
};

const lobbySlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRoomCode: (state, action) => {
      const code = action.payload;
      state.roomCode = code;
    },
    setPlayerList: (state, action) => {
        const playerList = action.payload;
        state.playerList = playerList;
      },


  },
});

export const { setRoomCode, setPlayerList } = lobbySlice.actions;
export default lobbySlice.reducer;

