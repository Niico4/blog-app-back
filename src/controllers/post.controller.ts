import { Request, Response } from 'express';

import Post from '../models/Post.model';

const handleErrors = (res: Response, error: any, message: string) => {
  console.error(error);
  res.status(500).json({ message });
};

const addNewPost = async (req: Request, res: Response) => {
  try {
    const { _id, ...postData } = req.body;
    const post = new Post({
      ...postData,
      user: req.user?._id,
      author: req.user?.email,
    });

    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    handleErrors(res, error, 'Error al guardar el post');
  }
};

const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({ user: req.user?._id });
    res.json(posts);
  } catch (error) {
    handleErrors(res, error, 'Error al obtener los posts');
  }
};

const getPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    if (post.user?.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Acción no válida' });
    }

    res.json(post);
  } catch (error) {
    handleErrors(res, error, 'Error al obtener el post');
  }
};

const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    if (post.user?.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Acción no válida' });
    }

    Object.assign(post, req.body);

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    handleErrors(res, error, 'Error al actualizar el post');
  }
};

const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    if (post.user?.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Acción no válida' });
    }

    await post.deleteOne();
    res.json({ message: 'Post eliminado' });
  } catch (error) {
    handleErrors(res, error, 'Error al eliminar el post');
  }
};

export { addNewPost, getPosts, getPost, deletePost, updatePost };
