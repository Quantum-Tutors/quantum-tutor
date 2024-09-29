import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  msgId: string;
  chatId: string;
  sender: string;
  text: string;
  moduleId?: string;
  createdAt: string;
  sequence: Number;
}

const MessageSchema: Schema<IMessage> = new Schema(
  {
    msgId: {
      type: String,
      unique: true,
      required: true,
    },
    chatId: {
      type: String,
      required: true,
    },
    sender: String,
    text: String,
    moduleId: {
      type: String,
      required: false,
    },
    createdAt: String,
    sequence: Number
  },
);

export default mongoose.models.messages || mongoose.model<IMessage>('messages', MessageSchema);