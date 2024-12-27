import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IUser } from '@interfaces/user.interface';

type SelectedChatState = {
  user: IUser | null;
};

const initialState: SelectedChatState = {
  user: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState: initialState,
  reducers: {
    setSelectedChat: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    removeSelectedChat: (state) => {
      state.user = null;
    },
  },
});

export const { setSelectedChat, removeSelectedChat } = chatSlice.actions;
export default chatSlice.reducer;
