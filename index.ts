import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoutes from './routes/user.routes';
import postRouter from './routes/post.routes';

const app = express();
app.use(express.json());

dotenv.config();
connectDB();

app.use('/api/users', userRoutes);
app.use('/api/posts', postRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
