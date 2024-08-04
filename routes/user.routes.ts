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
router.get('/confirm/:token', getUserConfirmed);
router.post('/login', authUser);

router.post('/reset-password', resetPassword);
router.route('/reset-password/:token').get(confirmedToken).post(newPassword);

router.get('/profile', checkAuth, getUserProfile);

export default router;
