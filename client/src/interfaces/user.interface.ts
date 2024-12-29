import { IApiResponse } from '@interfaces/index';

export type IUserRequest = {
  accessToken: string;
};

export type IUser = {
  _id: string;
  googleEmail: string;
  googleName: string;
  googlePicture: string;
};

export type IUserResponse = IApiResponse & {
  user: IUser;
};

export type ISearchUsersReponse = IApiResponse & {
  users: IUser[];
};
