import mongoose, { Schema } from "mongoose";

if (process.env.NODE_ENV === "development" && mongoose.models.DeactivationOtp) delete mongoose.models.DeactivationOtp;
const DeactivationOtpSchema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true }, codeHash: { type: String, required: true }, expiresAt: { type: Date, required: true, index: true }, attempts: { type: Number, default: 0 }, sentAt: { type: Date, required: true } }, { timestamps: true });
export default mongoose.models.DeactivationOtp || mongoose.model("DeactivationOtp", DeactivationOtpSchema);
