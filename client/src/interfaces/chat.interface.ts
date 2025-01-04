import { IApiResponse } from '@interfaces/index';
import { IUser } from '@interfaces/user.interface';

export type ICreateChatRequest = {
  messageFrom: string;
  messageTo: string;
  message: string;
};

export type IChat = {
  _id: string;
  conversationId: string;
  messageFrom: string;
  messageTo: string;
  message: string;
  attachmentName: string;
  attachmentData: string;
  createdAt: string;
  isRead: boolean;
  isEdited: boolean;
  isDeleted: boolean;
  reaction: string;
  replyMessageId: IChat;
};

export type ICreateChatResponse = IApiResponse & {
  chat: IChat;
};

export type IRecentChat = IChat & {
  userDetails: IUser;
};

export type IRecentChatResponse = IApiResponse & {
  chatList: IRecentChat[];
};

export type IGetChatResponse = IApiResponse & {
  chats: IChat[];
};

export type ISearchChatResponse = IApiResponse & {
  chats: IChat[];
};

export type IConversationResponse = IApiResponse & {
  conversationId: string;
};

export type IAddReactionRequest = {
  chatId: string;
  reaction: string;
};
