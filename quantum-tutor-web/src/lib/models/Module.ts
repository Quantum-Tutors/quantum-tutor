import mongoose, { Document, Schema } from 'mongoose';

export interface IModule extends Document {
  moduleId: string;
  chatId: string;
  title: String;
  messages: [String];
  createdAt: string;
  sequence: Number;
}

const ModuleSchema: Schema<IModule> = new Schema({
  moduleId: {
    type: String,
    unique: true,
    required: true,
  },
  chatId: {
    type: String,
    required: true,
  },
  title: String,
  messages: [String],
  createdAt: String,
  sequence: {
    type: Number,
		required: false
  },
});

export default mongoose.models.messages ||
  mongoose.model<IModule>('modules', ModuleSchema);
