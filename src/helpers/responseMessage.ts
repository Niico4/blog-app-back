import { Response } from 'express';
import { IUser } from '../models/User.model';

export const sendErrorMessage = (
  res: Response,
  statusCode: number,
  message: string
) => {
  const error = new Error(message);
  return res.status(statusCode).json({ message: error.message });
};

export const sendSuccessMessage = (
  res: Response,
  message: string,
  data?: IUser
) => {
  return res.json({ message, data });
};
