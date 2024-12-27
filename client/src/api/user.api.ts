import { AxiosResponse } from 'axios';

import axios from '@utils/axios';
import { IApiResponse } from '@src/interfaces';
import {
  ISearchUsersReponse,
  IUserRequest,
  IUserResponse,
} from '@interfaces/user.interface';

export const loginApi = async (
  accessToken: string,
): Promise<AxiosResponse<IUserResponse>> => {
  return axios.post<IUserResponse>('user/login', {
    accessToken: accessToken,
  } as IUserRequest);
};

export const getUserStatusApi = async (
  signal: AbortSignal,
): Promise<AxiosResponse<IUserResponse>> => {
  return axios.get<IUserResponse>('user/get-user-status', { signal });
};

export const logoutApi = async (
  signal: AbortSignal,
): Promise<AxiosResponse<IApiResponse>> => {
  return axios.get<IApiResponse>('user/logout', { signal });
};

export const searchUsersApi = (
  searchPrefix: string,
  signal: AbortSignal,
): Promise<AxiosResponse<ISearchUsersReponse>> => {
  return axios.get<ISearchUsersReponse>(`user/search/${searchPrefix}`, {
    signal,
  });
};

export const getUserDetailsApi = (
  id: string,
): Promise<AxiosResponse<IUserResponse>> => {
  return axios.get<IUserResponse>(`user/get-user-details-id/${id}`);
};
