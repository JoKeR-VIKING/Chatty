import { AxiosResponse } from 'axios';

import axios from '@utils/axios';
import { IUserRequest, IUserResponse } from '@interfaces/user.interface';

export const loginApi = async (
  accessToken: string,
): Promise<AxiosResponse<IUserResponse>> => {
  return axios.post<IUserResponse>('login', {
    accessToken: accessToken,
  } as IUserRequest);
};

export const getUserStatusApi = async (
  signal: AbortSignal,
): Promise<AxiosResponse<IUserResponse>> => {
  return axios.get<IUserResponse>('get-user-status', { signal });
};
