import mongoose, { Schema } from 'mongoose';

export interface IPost extends Document {
  title: string;
  author?: string;
  img?: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[] | null;
  user: mongoose.Schema.Types.ObjectId | undefined;
}

const postSchema: Schema<IPost> = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, trim: true },
    img: { type: String },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    tags: [{ type: String }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
