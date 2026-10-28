import mongoose, { Schema } from "mongoose";

export const USER_ROLES = ["SUPER_ADMIN", "ADMIN", "DRIVER"] as const;
export type UserRole = (typeof USER_ROLES)[number];

if (process.env.NODE_ENV === "development" && mongoose.models.User) delete mongoose.models.User;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: USER_ROLES, default: "DRIVER" },
  active: { type: Boolean, default: true },
  fullName: { type: String, default: "", trim: true },
  phone: { type: String, default: "", trim: true },
  state: { type: String, default: "", trim: true },
  city: { type: String, default: "", trim: true },
  preferredFuelType: { type: String, enum: ["PMS", "DIESEL", "LPG", "CNG"], default: "PMS" },
  defaultRadiusKm: { type: Number, default: 5, min: 1, max: 50 },
  notifications: {
    stationUpdates: { type: Boolean, default: true },
    communityUpdates: { type: Boolean, default: true },
  },
  vehicle: {
    make: { type: String, default: "", trim: true },
    model: { type: String, default: "", trim: true },
    year: { type: Number, default: null },
    fuelType: { type: String, enum: ["PMS", "DIESEL", "LPG", "CNG"], default: null },
    plateNumber: { type: String, default: "", trim: true },
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
