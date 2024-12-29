import { AxiosResponse } from 'axios';

import axios from '@utils/axios';
import {
  ICreateChatRequest,
  ICreateChatWithAttachmentRequest,
  ICreateChatResponse,
  IRecentChatResponse,
  IGetChatResponse,
} from '@interfaces/chat.interface';

export const sendMessageApi = (
  chat: ICreateChatRequest,
): Promise<AxiosResponse<ICreateChatResponse>> => {
  return axios.post<ICreateChatResponse>('chat/create/message', chat);
};

export const sendMessageWithAttachmentApi = (
  chat: ICreateChatWithAttachmentRequest,
): Promise<AxiosResponse<ICreateChatResponse>> => {
  return axios.post<ICreateChatResponse>(
    'chat/create/message-attachment',
    chat,
  );
};

export const getRecentChats = (
  signal: AbortSignal,
  messageFrom: string,
): Promise<AxiosResponse<IRecentChatResponse>> => {
  return axios.get(`chat/recent-chats/${messageFrom}`, { signal });
};

export const getChats = (
  signal: AbortSignal,
  conversationId: string,
): Promise<AxiosResponse<IGetChatResponse>> => {
  return axios.get(`chat/conversation/${conversationId}`, { signal });
};
