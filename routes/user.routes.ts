import express from 'express';
import {
  authUser,
  confirmedToken,
  getUserConfirmed,
  getUserProfile,
  newPassword,
  registerUser,
  resetPassword,
} from '../controllers/user.controller';
import checkAuth from '../middleware/auth';

const router = express.Router();

router.post('/', registerUser);
router.get(`/auth/confirm-account/:token`, getUserConfirmed);
router.post('/auth/login', authUser);

router.post('/auth/forgot-password', resetPassword);
router
  .route('/auth/forgot-password/:token')
  .get(confirmedToken)
  .post(newPassword);

router.get('/admin/profile', checkAuth, getUserProfile);

export default router;
