import mongoose, { Schema } from "mongoose";
const AssignmentSchema = new Schema({ stationId: { type: Schema.Types.ObjectId, ref: "Station", required: true, index: true }, userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, assignedBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, active: { type: Boolean, default: true } }, { timestamps: true });
AssignmentSchema.index({ userId: 1 }, { unique: true });
export default mongoose.models.StationAdminAssignment || mongoose.model("StationAdminAssignment", AssignmentSchema);
