import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosRequestHeaders, AxiosResponse } from 'axios';

import { IApiResponse } from '@src/interfaces';
import {
  ICreateChatRequest,
  ICreateChatResponse,
  IRecentChatResponse,
  IGetChatResponse,
  ISearchChatResponse,
} from '@interfaces/chat.interface';
import {
  sendMessageApi,
  sendMessageWithAttachmentApi,
  getRecentChats,
  getChats,
  getSearchChats,
} from '@api/chat.api';

type CreateChatProps = {
  onSuccess: (chat: AxiosResponse<ICreateChatResponse>) => void;
  onError: (chat: AxiosError<IApiResponse>) => void;
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

export const useGetChats = (conversationId: string) => {
  return useQuery<AxiosResponse<IGetChatResponse>>({
    queryKey: ['chat', conversationId],
    queryFn: ({ signal }) => getChats(signal, conversationId),
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
