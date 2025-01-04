import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosRequestHeaders, AxiosResponse } from 'axios';

import { IApiResponse } from '@src/interfaces';
import {
  ICreateChatRequest,
  ICreateChatResponse,
  IRecentChatResponse,
  IGetChatResponse,
  ISearchChatResponse,
  IConversationResponse,
  IAddReactionRequest,
} from '@interfaces/chat.interface';
import {
  sendMessageApi,
  sendMessageWithAttachmentApi,
  getRecentChats,
  getChats,
  getSearchChats,
  getConversationId,
  addReaction,
  readMessage,
} from '@api/chat.api';

type CreateChatProps = {
  onSuccess: (chat: AxiosResponse<ICreateChatResponse>) => void;
  onError: (chat: AxiosError<IApiResponse>) => void;
};

type AddReactionProps = {
  onError: (result: AxiosError<IApiResponse>) => void;
};

export const useSendMessage = ({ onSuccess, onError }: CreateChatProps) => {
  return useMutation<
    AxiosResponse<ICreateChatResponse>,
    AxiosError<IApiResponse>,
    ICreateChatRequest
  >({
    mutationKey: ['send-message'],
    mutationFn: (chat: ICreateChatRequest) => sendMessageApi(chat),
    onSuccess: onSuccess,
    onError: onError,
    retry: false,
  });
};

export const useSendMessageWithAttachment = ({
  onSuccess,
  onError,
}: CreateChatProps) => {
  return useMutation<
    AxiosResponse<ICreateChatResponse>,
    AxiosError<IApiResponse>,
    FormData
  >({
    mutationKey: ['send-message-with-attachment'],
    mutationFn: (chat: FormData) => sendMessageWithAttachmentApi(chat),
    onSuccess: onSuccess,
    onError: onError,
    retry: false,
  });
};

export const useGetRecentChats = (messageFrom: string) => {
  return useQuery<AxiosResponse<IRecentChatResponse>>({
    queryKey: ['recent-chats'],
    queryFn: ({ signal }) => getRecentChats(signal, messageFrom),
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: false,
    enabled: !!messageFrom,
  });
};

export const useGetChats = (conversationId: string, currentUserId: string) => {
  return useQuery<AxiosResponse<IGetChatResponse>>({
    queryKey: ['chat', conversationId],
    queryFn: ({ signal }) => getChats(signal, conversationId, currentUserId),
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: false,
    enabled: !!conversationId,
  });
};

export const useSearchChats = (
  conversationId: string,
  searchPrefix: string,
) => {
  return useQuery<AxiosResponse<ISearchChatResponse>, AxiosError<IApiResponse>>(
    {
      queryKey: ['chat-search', searchPrefix],
      queryFn: ({ signal }) =>
        getSearchChats(signal, conversationId, searchPrefix),
      retry: false,
      staleTime: 0,
      refetchOnWindowFocus: false,
      initialData: () => {
        const mockResponse: AxiosResponse<ISearchChatResponse> = {
          data: {
            message: 'Empty query',
            chats: [],
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {
            headers: {} as AxiosRequestHeaders,
          },
        };
        return mockResponse;
      },
      enabled: !!searchPrefix,
    },
  );
};

export const useGetConversation = (messageFrom: string, messageTo: string) => {
  return useQuery<
    AxiosResponse<IConversationResponse>,
    AxiosError<IApiResponse>
  >({
    queryKey: ['conversation', messageFrom, messageTo],
    queryFn: ({ signal }) => getConversationId(signal, messageFrom, messageTo),
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    enabled: Boolean(messageFrom && messageTo),
  });
};

export const useAddReaction = ({ onError }: AddReactionProps) => {
  return useMutation<
    AxiosResponse<IApiResponse>,
    AxiosError<IApiResponse>,
    IAddReactionRequest
  >({
    mutationKey: ['add-reaction'],
    mutationFn: ({ chatId, reaction }) => addReaction(chatId, reaction),
    onError: (err) => onError(err),
    retry: false,
  });
};

export const useReadMessage = () => {
  return useMutation<
    AxiosResponse<IApiResponse>,
    AxiosError<IApiResponse>,
    string
  >({
    mutationKey: ['add-reaction'],
    mutationFn: (chatId) => readMessage(chatId),
    retry: false,
  });
};
