import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';

import userService from '@services/user.service';
import { IUserDocument, IGoogleUser } from '@interfaces/user.interface';
import { convertUrlToBase64 } from '@utils/helpers';
import { chatSocketObject } from '@sockets/chat.socket';

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
      const base64url = await convertUrlToBase64(result?.picture);

      const user: IUserDocument = await userService.login({
        googleEmail: result?.email,
        googleName: result?.given_name + ' ' + result?.family_name,
        googlePicture: base64url,
      } as IUserDocument);

      req.session.userId = user?._id;
      req.session.user = {
        _id: user?._id,
        googleEmail: user?.googleEmail,
        googleName: user?.googleName,
        googlePicture: user?.googlePicture,
      };

      res.status(StatusCodes.OK).json({
        message: 'User logged in successfully.',
        user: req.session.user,
      });
    } catch (err) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Error logging user.', error: err });
      next(err);
    }
  }

  public async getUserStatus(req: Request, res: Response): Promise<void> {
    res
      .status(StatusCodes.OK)
      .json({ message: 'User session is valid.', user: req.session.user });
  }

  public async logout(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    req.session.destroy((err) => {
      if (err) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Something went wrong.', error: err });
        next(err);
      }

      res.clearCookie('connect.sid');
      res
        .status(StatusCodes.OK)
        .json({ message: 'User logged out successfully.' });
    });
  }

  public async searchUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { searchPrefix } = req.params;

    try {
      const userList: IUserDocument[] = await userService.searchUser(
        req.session.user?.googleEmail as string,
        searchPrefix,
      );

      res.status(StatusCodes.OK).json({
        message: `Search result for user prefix: ${searchPrefix}.`,
        users: userList,
      });
    } catch (err) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: `Error searching user prefix: ${searchPrefix}.`,
        error: err,
      });
      next(err);
    }
  }

  public async getUserDetailsById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { id } = req.params;

    try {
      const user: IUserDocument = await userService.getUserDetailsById(id);

      res
        .status(StatusCodes.OK)
        .json({ message: 'User details fetched successfully.', user: user });
    } catch (err) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Error getting user details.' });
      next(err);
    }
  }

  public async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { profileName, profileImage } = req.body;

    try {
      if (!req.session.user?._id) throw new Error('No user');

      const user = await userService.updateProfile(
        profileName,
        profileImage,
        req.session.user?._id.toString(),
      );

      req.session.user = user as IUserDocument;
      req.session.save((err) => {
        if (err) throw new Error(err);
      });

      chatSocketObject.emit('update-profile', user);

      res.status(StatusCodes.OK).json({
        message: 'Successfully updated user profile',
        user: user,
      });
    } catch (err) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Error updating user profile',
      });
      next(err);
    }
  }
}

export default UserController;
