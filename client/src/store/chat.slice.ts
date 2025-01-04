import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IUser } from '@interfaces/user.interface';

type IReplyChat = {
  _id: string;
  message: string;
  attachmentData: string;
  messageFrom: string;
};

type SelectedChatState = {
  selectedChatUser: IUser | null;
  conversationId: string;
  searchChatPrefix: string;
  replyChat: IReplyChat | null;
};

const initialState: SelectedChatState = {
  selectedChatUser: null,
  conversationId: '',
  searchChatPrefix: '',
  replyChat: null,
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
    setReplyChat: (state, action: PayloadAction<IReplyChat>) => {
      state.replyChat = action.payload;
    },
    removeReplyChat: (state) => {
      state.replyChat = null;
    },
  },
});

export const {
  setSelectedChat,
  setConversationId,
  removeSelectedChat,
  setSearchChatPrefix,
  setReplyChat,
  removeReplyChat,
} = chatSlice.actions;
export default chatSlice.reducer;
