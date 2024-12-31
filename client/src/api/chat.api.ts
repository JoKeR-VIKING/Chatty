import { AxiosResponse } from 'axios';

import axios from '@utils/axios';
import {
  ICreateChatRequest,
  ICreateChatResponse,
  IRecentChatResponse,
  IGetChatResponse,
  ISearchChatResponse,
} from '@interfaces/chat.interface';

export const sendMessageApi = (
  chat: ICreateChatRequest,
): Promise<AxiosResponse<ICreateChatResponse>> => {
  return axios.post<ICreateChatResponse>('chat/create/message', chat);
};

export const sendMessageWithAttachmentApi = (
  chat: FormData,
): Promise<AxiosResponse<ICreateChatResponse>> => {
  return axios.post<ICreateChatResponse>(
    'chat/create/message-attachment',
    chat,
    { headers: { 'Content-Type': 'multipart/form-data' } },
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

export const getSearchChats = (
  signal: AbortSignal,
  conversationId: string,
  searchChatPrefix: string,
): Promise<AxiosResponse<ISearchChatResponse>> => {
  return axios.get(
    `chat/search-chat-message/${conversationId}/${searchChatPrefix}`,
    { signal },
  );
};
