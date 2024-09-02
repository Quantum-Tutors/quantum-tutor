import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';


interface IReport {
  category: string[];
}

export interface IMessage extends Document {
  messageId: string;
  ai: string;
  user: string;
  feedback?: number;
  report?: IReport[];
}

const ReportSchema: Schema<IReport> = new Schema({
  category: {
    type: [String],
    required: true,
  },
});

const MessageSchema: Schema<IMessage> = new Schema(
  {
    messageId: {
      type: String,
      default: uuidv4,
      unique: true,
      required: true,
    },
    ai: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
      unique: true,
    },
    feedback: {
      type: Number,
    },
    report: {
      type: [ReportSchema],
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
