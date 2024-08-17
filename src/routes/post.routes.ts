import express from 'express';
import {
  addNewPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from '../controllers/post.controller';
import checkAuth from '../middleware/auth';
const router = express.Router();

router.route('/').post(checkAuth, addNewPost).get(checkAuth, getPosts);
router
  .route('/:id')
  .get(checkAuth, getPost)
  .put(checkAuth, updatePost)
  .delete(checkAuth, deletePost);

export default router;
