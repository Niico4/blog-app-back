import { Request, Response } from 'express';
import User from '../models/User.model';
import generateJWT from '../helpers/generateJWT';
import { randomUUID } from 'crypto';
import emailRegister from '../helpers/emailRegister';
import emailResetPassword from '../helpers/emailResetPassword';

const errorMessage = (res: Response, numberError: number, message: string) => {
  const error = new Error(message);
  return res.status(numberError).json({ message: error.message });
};

const okMessage = (res: Response, message: string) => {
  return res.json({ message });
};

const registerUser = async (req: Request, res: Response) => {
  const { email, name } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return errorMessage(res, 404, 'El usuario ya esta registrado');
  }

  try {
    const user = new User(req.body);
    const userSave = await user.save();

    if (!userSave.token) return;
    emailRegister({ email, name, token: userSave.token });

    res.json(userSave);
  } catch (error) {
    console.log(error);
  }
};

const getUserProfile = (req: Request, res: Response) => {
  const { user } = req;

  res.json(user);
};

const getUserConfirmed = async (req: Request, res: Response) => {
  const { token } = req.params;

  const userConfirm = await User.findOne({ token });

  if (!userConfirm) {
    return errorMessage(res, 404, 'El usuario no existe');
  }

  try {
    if (userConfirm) {
      userConfirm.token = null;
      userConfirm.confirmedUser = true;
      await userConfirm?.save();
    }

    okMessage(res, 'Usuario confirmado correctamente');
  } catch (error) {
    console.log(error);
  }
};

const authUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return errorMessage(res, 404, 'El usuario no existe');
  }

  if (!user.confirmedUser) {
    return errorMessage(res, 404, 'Cuenta no confirmada');
  }

  try {
    if (!(await user.checkPassword(password))) {
      return errorMessage(res, 404, 'Contraseña incorrecta');
    }

    res.json({ token: generateJWT(user.id) });
    return errorMessage(res, 200, 'Contraseña correcta');
  } catch (error) {
    console.log(error);
  }

  okMessage(res, 'Autenticación exitosa');
};

const resetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const userExist = await User.findOne({ email });

  if (!userExist) {
    return errorMessage(res, 404, 'El usuario no existe');
  }

  if (!userExist.confirmedUser) {
    return errorMessage(res, 404, 'Cuenta no confirmada');
  }

  try {
    userExist.token = randomUUID();
    await userExist.save();

    emailResetPassword({
      email,
      name: userExist.name,
      token: userExist.token,
    });

    return okMessage(res, 'Se ha enviado un email de verificación');
  } catch (error) {
    console.log(error);
  }
};

const confirmedToken = async (req: Request, res: Response) => {
  const { token } = req.params;

  const validToken = await User.findOne({ token });

  if (!validToken) {
    return errorMessage(res, 404, 'Token no válido');
  }

  return okMessage(res, 'Token válido');
};

const newPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ token });

  if (!user) {
    return errorMessage(res, 404, 'Ha ocurrido un error');
  }

  try {
    user.token = null;
    user.password = password;

    await user.save();
    return okMessage(res, 'Contraseña actualizada correctamente');
  } catch (error) {
    console.log(error);
  }
};

export {
  registerUser,
  getUserProfile,
  getUserConfirmed,
  authUser,
  resetPassword,
  confirmedToken,
  newPassword,
};
