import { configureStore } from '@reduxjs/toolkit';

import userReducer from '@store/user.slice';
import chatReducer from '@store/chat.slice';

const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
