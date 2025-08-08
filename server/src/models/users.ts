// server/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

// 1. Define TypeScript interface
export interface IUser extends Document {
  name: string;
  email: string;
}

// 2. Define schema
const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

// 3. Export model
const UserModel = mongoose.model<IUser>('User', userSchema);
export default UserModel;
