import { IApiResponse } from '@interfaces/index';

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
  conversationId: string;
  messageFrom: string;
  messageTo: string;
  message: string;
  attachmentName: string;
  attachmentData: string;
  createdAt: Date;
  isRead: boolean;
  isEdited: boolean;
  isDeleted: boolean;
};

export type ICreateChatResponse = IApiResponse & {
  chat: IChat;
};

export type IRecentChatResponse = IApiResponse & {
  chatList: IChat[];
};
