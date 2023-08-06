import mongoose, { Schema, Document } from "mongoose";

export interface TodoDocument extends Document {
  title: string;
  description: string;
  completed: boolean;
}

const todoSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

export default mongoose.model<TodoDocument>("Todo", todoSchema);
