import mongoose, { Document, Schema } from 'mongoose';

interface IExchange {
  title?: string;
  messageId?: string;
  messageIds?: string[];
}

export interface IChat extends Document {
  chatId: string;
  fileIds: number[];
  exchanges: IExchange[];
}

const ExchangeSchema: Schema<IExchange> = new Schema(
  {
    title: {
      type: String,
      required: false,
    },
    messageId: {
      type: String,
      required: false,
    },
    messageIds: {
      type: [String],
      required: false,
    },
  },
  { _id: false }
);

const ChatSchema: Schema<IChat> = new Schema(
  {
    chatId: {
      type: String,
      required: true,
      unique: true,
    },
    fileIds: {
      type: [Number],
      required: true,
    },
    exchanges: {
      type: [ExchangeSchema],
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const ChatModel = mongoose.model<IChat>('Chats', ChatSchema);

export default ChatModel;
