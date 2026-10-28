import mongoose, { Schema } from "mongoose";

if (process.env.NODE_ENV === "development" && mongoose.models.SuperAdminInvite) delete mongoose.models.SuperAdminInvite;
const SuperAdminInviteSchema = new Schema({ email: { type: String, required: true, lowercase: true, unique: true }, tokenHash: { type: String, required: true, unique: true }, invitedBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, expiresAt: { type: Date, required: true }, sentAt: { type: Date }, usedAt: { type: Date } }, { timestamps: true });
SuperAdminInviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export default mongoose.models.SuperAdminInvite || mongoose.model("SuperAdminInvite", SuperAdminInviteSchema);
