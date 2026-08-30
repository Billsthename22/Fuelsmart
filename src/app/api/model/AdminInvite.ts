import mongoose, { Schema } from "mongoose";
const AdminInviteSchema = new Schema({ applicationId: { type: Schema.Types.ObjectId, ref: "StationApplication", required: true, unique: true }, email: { type: String, required: true, lowercase: true }, tokenHash: { type: String, required: true, unique: true }, expiresAt: { type: Date, required: true }, sentAt: { type: Date }, usedAt: { type: Date } }, { timestamps: true });
AdminInviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export default mongoose.models.AdminInvite || mongoose.model("AdminInvite", AdminInviteSchema);
