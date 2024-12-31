import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IUser } from '@interfaces/user.interface';

type SelectedChatState = {
  selectedChatUser: IUser | null;
  conversationId: string;
  searchChatPrefix: string;
};

const initialState: SelectedChatState = {
  selectedChatUser: null,
  conversationId: '',
  searchChatPrefix: '',
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
    setSearchChatPrefix: (state, action: PayloadAction<string>) => {
      state.searchChatPrefix = action.payload;
    },
  },
});

export const {
  setSelectedChat,
  setConversationId,
  removeSelectedChat,
  setSearchChatPrefix,
} = chatSlice.actions;
export default chatSlice.reducer;
