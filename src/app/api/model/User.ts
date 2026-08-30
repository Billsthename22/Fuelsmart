import mongoose, { Schema } from "mongoose";

export const USER_ROLES = ["SUPER_ADMIN", "ADMIN", "DRIVER"] as const;
export type UserRole = (typeof USER_ROLES)[number];

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: USER_ROLES, default: "DRIVER" },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
