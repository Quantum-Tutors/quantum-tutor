import mongoose, { Document, Schema } from 'mongoose';

export interface IChatSession extends Document {
  chatId: String;
  userId: String;
  title: String;
  createdAt: String;
  messages: String[];
  modules: String[];
  currentModule: String;
}

const ChatSessionSchema: Schema<IChatSession> = new Schema(
  {
    chatId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String
    },
		title: String,
		createdAt: String,
    messages: [String],
    modules: [String],
    currentModule: String
  },
);

export default  mongoose.models.chat_sessions ||  mongoose.model<IChatSession>('chat_sessions', ChatSessionSchema);