import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const db = await mongoose.connect(
      process.env.MONGODB_URI ?? 'MongoDB uri undefined'
    );

    // TODO: Comment
    const url = `${db.connection.host}:${db.connection.port}`;
    console.log(`MongoDB connect in: ${url}`);
  } catch (error) {
    console.log();
    process.exit(1);
  }
};

export default connectDB;
