import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

export interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  webSite?: string;
  token?: string | null;
  confirmedUser: boolean;
  checkPassword(passwordForm: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
    default: null,
  },
  webSite: {
    type: String,
    trim: true,
    default: null,
  },
  token: {
    type: String,
  },
  confirmedUser: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.token = randomUUID();
  }

  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.log(error);
  }
});

userSchema.methods.checkPassword = async function (passwordForm: string) {
  return await bcrypt.compare(passwordForm, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
