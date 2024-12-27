import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req?.session?.userId) return next();

  res.clearCookie('connect.sid');
  res
    .status(StatusCodes.UNAUTHORIZED)
    .json({ message: 'Session is expired. Please login again.' });
};
