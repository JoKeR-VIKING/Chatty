import { IApiResponse } from '@interfaces/index';
import { IUser } from '@interfaces/user.interface';

export type ICreateChatRequest = {
  messageFrom: string;
  messageTo: string;
  message: string;
};

export type ICreateChatWithAttachmentRequest = {
  messageFrom: string;
  messageTo: string;
  attachmentName: string;
  attachmentData: File;
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
