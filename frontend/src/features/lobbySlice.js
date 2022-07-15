import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    roomCode: "",
    playerList: [],
    messageList: [],
    game: {
      state: 1,
      currentDrawer: "",
      currentRound: 1,
      numberOfRounds: 3,
    },
};

const lobbySlice = createSlice({
  name: 'lobby',
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
    setGame: (state, action) => {
      const game = action.payload;
      state.game = game;
    },
    setMessages: (state, action) => {
      const messages = action.payload;
      state.messageList = messages;
    }


  },
});

export const { setRoomCode, setPlayerList, setGame } = lobbySlice.actions;
export default lobbySlice.reducer;

