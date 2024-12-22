import { useMutation, useQuery, QueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

import { IApiResponse } from '@src/interfaces';
import { IUserRequest, IUserResponse } from '@interfaces/user.interface';
import { loginApi, getUserStatusApi } from '@api/user.api';

type UserLoginProps = {
  onLoginSuccess: (data: AxiosResponse<IApiResponse>) => void;
  onLoginError: (error: AxiosError<IApiResponse>) => void;
};

const queryClient: QueryClient = new QueryClient();

export const useLogin = ({ onLoginSuccess, onLoginError }: UserLoginProps) => {
  return useMutation<
    AxiosResponse<IApiResponse>,
    AxiosError<IApiResponse>,
    IUserRequest
  >({
    mutationKey: ['login'],
    mutationFn: ({ accessToken }) => loginApi(accessToken),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['user-status'] });
      onLoginSuccess(data);
    },
    onError: onLoginError,
    retry: false,
  });
};

export const useUserStatus = () => {
  return useQuery<AxiosResponse<IUserResponse>, AxiosError<IApiResponse>>({
    queryKey: ['user-status'],
    queryFn: ({ signal }) => getUserStatusApi(signal),
    retry: false,
    staleTime: 0,
  });
};
