import express from 'express';

import { authenticateUser, getUserConfirmed, getUserProfile, registerNewUser, requestPasswordReset, updatePassword, updateProfile, verifyToken } from '../controllers/user.controller';
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
router.put('/user/profile/:id', checkAuth, updateProfile);

export default router;
