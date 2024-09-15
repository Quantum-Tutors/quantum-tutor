import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  image: string;
}

const UserSchema: Schema<IUser> = new Schema(
  {
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  image: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>('Users', UserSchema);

export default User;
