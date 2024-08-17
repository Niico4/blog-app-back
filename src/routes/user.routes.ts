import express from 'express';
import {
  authenticateUser,
  verifyToken,
  getUserConfirmed,
  getUserProfile,
  updatePassword,
  registerNewUser,
  requestPasswordReset,
} from '../controllers/user.controller';
import checkAuth from '../middleware/auth';

const router = express.Router();

router.post('/auth/register', registerNewUser);
router.post('/auth/login', authenticateUser);

router.get(`/auth/confirm-account/:token`, getUserConfirmed);

router.post('/auth/forgot-password', requestPasswordReset);
router
  .route('/auth/forgot-password/:token')
  .get(verifyToken)
  .post(updatePassword);

router.get('/user/profile', checkAuth, getUserProfile);

export default router;
