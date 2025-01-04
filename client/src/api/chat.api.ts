import { AxiosResponse } from 'axios';

import axios from '@utils/axios';
import { IApiResponse } from '@src/interfaces';
import {
  ICreateChatRequest,
  ICreateChatResponse,
  IRecentChatResponse,
  IGetChatResponse,
  ISearchChatResponse,
  IConversationResponse,
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
  currentUserId: string,
): Promise<AxiosResponse<IGetChatResponse>> => {
  return axios.get(`chat/conversation/${conversationId}/${currentUserId}`, {
    signal,
  });
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

export const getConversationId = (
  signal: AbortSignal,
  messageFrom: string,
  messageTo: string,
): Promise<AxiosResponse<IConversationResponse>> => {
  return axios.get(`/chat/get-conversation/${messageFrom}/${messageTo}`, {
    signal,
  });
};

export const addReaction = (
  chatId: string,
  reaction: string,
): Promise<AxiosResponse<IApiResponse>> => {
  return axios.post('/chat/create/reaction', { chatId, reaction });
};

export const readMessage = (chatId: string) => {
  return axios.post('/chat/read-chat-message', { chatId });
};
