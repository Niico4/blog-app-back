import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User, { IUser } from '../models/User.model';

declare global {
  namespace Express {
    interface Request {
      user?: IUser | null;
    }
  }
}

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  ) {
    const error = new Error('Token no válido o inexistente');
    return res.status(404).json({ message: error.message });
  }

  try {
    token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new Error('Token no definido');
    }

    if (!process.env.JWT_SECRET_KEY) {
      throw new Error('No se encontró la clave secreta para el token');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as JwtPayload;

    const user = await User.findById(decoded.id).select(
      '-password -token -confirmedUser'
    );

    req.user = user;

    return next();
  } catch (err) {
    const error = new Error('Token no válido');
    res.status(404).json({ message: error.message });
  }

  next();
};

export default checkAuth;
