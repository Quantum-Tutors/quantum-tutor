import mongoose, { Document, ObjectId, Schema } from 'mongoose';

export interface IUser extends Document {
  name: String;
  email: String;
  image: String;
  emailVerified: Boolean;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    image: { type: String, required: false },
    emailVerified: Boolean
  }
);

const User = mongoose.models.users || mongoose.model<IUser>('users', UserSchema);

export default User;
