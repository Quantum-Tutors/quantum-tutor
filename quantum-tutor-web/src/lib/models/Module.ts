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
  moduleId: String,
  chatId: {
    type: String,
    required: true,
  },
  title: String,
  messages: [String],
  createdAt: String,
  sequence: Number
});

export default mongoose.models.modules ||
  mongoose.model<IModule>('modules', ModuleSchema);
