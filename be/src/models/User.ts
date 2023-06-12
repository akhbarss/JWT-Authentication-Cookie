import mongoose, { Document, Schema } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model<UserDocument>("User", userSchema);
