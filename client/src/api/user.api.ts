import { AxiosResponse } from 'axios';

import axios from '@utils/axios';
import { IApiResponse } from '@src/interfaces';
import { IUserRequest, IUserResponse } from '@interfaces/user.interface';

export const loginApi = async (
  accessToken: string,
): Promise<AxiosResponse<IApiResponse>> => {
  return axios.post<IApiResponse>('login', {
    accessToken: accessToken,
  } as IUserRequest);
};

export const getUserStatusApi = async (
  signal: AbortSignal,
): Promise<AxiosResponse<IUserResponse>> => {
  return axios.get<IUserResponse>('get-user-status', { signal });
};
