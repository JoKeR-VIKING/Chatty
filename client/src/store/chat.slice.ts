import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IUser } from '@interfaces/user.interface';

type SelectedChatState = {
  selectedChatUser: IUser | null;
  conversationId: string;
};

const initialState: SelectedChatState = {
  selectedChatUser: null,
  conversationId: '',
};

const chatSlice = createSlice({
  name: 'chat',
  initialState: initialState,
  reducers: {
    setSelectedChat: (state, action: PayloadAction<IUser>) => {
      state.selectedChatUser = action.payload;
    },
    setConversationId: (state, action: PayloadAction<string>) => {
      state.conversationId = action.payload;
    },
    removeSelectedChat: (state) => {
      state.selectedChatUser = null;
      state.conversationId = '';
    },
  },
});

export const { setSelectedChat, setConversationId, removeSelectedChat } =
  chatSlice.actions;
export default chatSlice.reducer;
