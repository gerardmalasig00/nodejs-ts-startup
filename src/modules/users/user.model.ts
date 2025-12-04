import { Schema, model, Document } from "mongoose";

export enum Role {
  ADMIN = "admin",
  MANAGER = "manager",
  USER = "user",
}

export interface IUser extends Document {
  email: string;
  password: string;
  roles: Role[];
  refreshTokens: string[]; // persisted refresh tokens (hashed or raw - see security note)
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    roles: { type: [String], enum: Object.values(Role), default: [Role.USER] },
    refreshTokens: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default model<IUser>("User", UserSchema);
