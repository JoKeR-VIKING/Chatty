import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';

import userService from '@services/user.service';
import { IUserDocument, IGoogleUser } from '@interfaces/user.interface';

class UserController {
  private async getUserDetails(accessToken: string) {
    try {
      const response: AxiosResponse<IGoogleUser> = await axios.get(
        `https://www.googleapis.com/oauth2/v2/userinfo`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      return response?.data;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { accessToken } = req.body;
      const result = await UserController.prototype.getUserDetails(accessToken);

      const user: IUserDocument = await userService.login({
        googleEmail: result?.email,
        googleName: result?.given_name + ' ' + result?.family_name,
        googlePicture: result?.picture,
      } as IUserDocument);

      req.session.userId = user?._id;
      req.session.user = {
        googleEmail: result?.email,
        googleName: result?.given_name + ' ' + result?.family_name,
        googlePicture: result?.picture,
      };

      res
        .status(StatusCodes.OK)
        .json({ message: 'User logged in successfully.' });
    } catch (err) {
      res.status(StatusCodes.BAD_REQUEST).json(err);
      next(err);
    }
  }

  public async getUserStatus(req: Request, res: Response): Promise<void> {
    res
      .status(StatusCodes.OK)
      .json({ message: 'User session is valid.', user: req.session.user });
  }
}

export default UserController;
