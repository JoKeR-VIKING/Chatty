import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

import { IApiResponse } from '@src/interfaces';
import {
  ICreateChatRequest,
  ICreateChatWithAttachmentRequest,
  ICreateChatResponse,
  IRecentChatResponse,
} from '@interfaces/chat.interface';
import {
  sendMessageApi,
  sendMessageWithAttachmentApi,
  getRecentChats,
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
    ICreateChatWithAttachmentRequest
  >({
    mutationKey: ['send-message-with-attachment'],
    mutationFn: (chat: ICreateChatWithAttachmentRequest) =>
      sendMessageWithAttachmentApi(chat),
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
