import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import lobbyReducer from '../features/lobbySlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    lobby: lobbyReducer,
  },
});
