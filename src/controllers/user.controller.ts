import { Request, Response } from 'express';
import User from '../models/User.model';
import generateJWT from '../helpers/generateJWT';
import { randomUUID } from 'crypto';
import {
  sendErrorMessage,
  sendSuccessMessage,
} from '../helpers/responseMessage';
import { body, validationResult } from 'express-validator';
import {
  sendAccountConfirmationEmail,
  sendPasswordResetEmail,
} from '../services/index.service';

export const validateUser = [
  body('email')
    .isEmail()
    .withMessage('Debe proporcionar un correo electrónico válido'),
  body('name')
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage('El nombre es obligatorio y debe tener al menos 3 caracteres'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/[0-9]/)
    .withMessage('La contraseña debe contener al menos un número')
    .matches(/[a-zA-Z]/)
    .withMessage('La contraseña debe contener al menos una letra'),
];

const registerNewUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorMessage(res, 400, 'Datos de entrada inválidos');
  }

  const { email, name } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return sendErrorMessage(res, 400, 'El usuario ya esta registrado');
  }

  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();

    if (!savedUser.token) {
      return sendErrorMessage(res, 500, 'Error al registrar el usuario');
    }

    sendAccountConfirmationEmail({ email, name, token: savedUser.token });

    return sendSuccessMessage(res, 'Usuario creado con éxito', savedUser);
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    return sendErrorMessage(res, 500, 'Error al registrar el usuario');
  }
};

const getUserProfile = (req: Request, res: Response) => {
  try {
    const { user } = req;

    if (!user) {
      return sendErrorMessage(res, 401, 'Usuario no autenticado');
    }

    return res.json({
      _id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      webSite: user.webSite,
      token: user.token,
      confirmedUser: user.confirmedUser,
    });
  } catch (error) {
    console.error('Error al obtener el perfil del usuario: ', error);
    return sendErrorMessage(res, 500, 'Error al obtener el perfil del usuario');
  }
};

const getUserConfirmed = async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const userConfirm = await User.findOne({ token });

    if (!userConfirm) {
      return sendErrorMessage(res, 404, 'El usuario no existe');
    }

    userConfirm.token = null;
    userConfirm.confirmedUser = true;
    await userConfirm.save();

    return sendSuccessMessage(res, 'Usuario confirmado correctamente');
  } catch (error) {
    console.error('Error al confirmar el usuario: ', error);
    return sendErrorMessage(res, 500, 'Error al confirmar el usuario');
  }
};

const authenticateUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!email || !password) {
    return sendErrorMessage(res, 400, 'Email y contraseña son obligatorios');
  }

  try {
    if (!user) {
      return sendErrorMessage(res, 404, 'El usuario no existe');
    }

    if (!user.confirmedUser) {
      return sendErrorMessage(res, 404, 'Cuenta no confirmada');
    }
    if (!(await user.checkPassword(password))) {
      return sendErrorMessage(res, 401, 'Contraseña incorrecta');
    }

    const token = generateJWT(user._id);
    return res.json({ token });
  } catch (error) {
    console.log(error);
    return sendErrorMessage(res, 500, 'Error en la autenticación');
  }
};

const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return sendErrorMessage(res, 400, 'Email es obligatorio');
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return sendErrorMessage(res, 404, 'El usuario no existe');
    }

    if (!user.confirmedUser) {
      return sendErrorMessage(res, 404, 'Cuenta no confirmada');
    }

    user.token = randomUUID();
    await user.save();

    await sendPasswordResetEmail({
      email,
      name: user.name,
      token: user.token,
    });

    return sendSuccessMessage(res, 'Se ha enviado un email de verificación');
  } catch (error) {
    console.log(error);
    return sendErrorMessage(res, 500, 'Error al restablecer la contraseña');
  }
};

const verifyToken = async (req: Request, res: Response) => {
  const { token } = req.params;

  if (!token) {
    return sendErrorMessage(res, 400, 'El token es obligatorio');
  }
  try {
    const userToken = await User.findOne({ token });

    if (!userToken) {
      return sendErrorMessage(res, 404, 'Token no válido o expirado.');
    }

    return sendSuccessMessage(res, 'Token confirmado exitosamente');
  } catch (error) {
    console.error('Error al verificar el token: ', error);
    return sendErrorMessage(
      res,
      500,
      'Error interno del servidor al verificar el token.'
    );
  }
};

const updatePassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) {
    return sendErrorMessage(
      res,
      400,
      'El token y la contraseña son obligatorios'
    );
  }

  try {
    const userToken = await User.findOne({ token });

    if (!userToken) {
      return sendErrorMessage(res, 404, 'Token no válido o expirado');
    }

    userToken.token = null;
    userToken.password = password;

    await userToken.save();
    return sendSuccessMessage(res, 'Contraseña actualizada correctamente');
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    return sendErrorMessage(
      res,
      500,
      'Error interno del servidor al actualizar la contraseña.'
    );
  }
};

export {
  authenticateUser,
  getUserConfirmed,
  getUserProfile,
  registerNewUser,
  requestPasswordReset,
  updatePassword,
  verifyToken,
};
