import mongoose, { Schema } from "mongoose";
const PriceHistorySchema = new Schema({ stationId: { type: Schema.Types.ObjectId, ref: "Station", required: true, index: true }, fuelType: { type: String, enum: ["PMS", "DIESEL", "LPG", "CNG"], required: true }, price: { type: Number, required: true, min: 0 }, available: { type: Boolean, default: true }, updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true } }, { timestamps: true });
export default mongoose.models.PriceHistory || mongoose.model("PriceHistory", PriceHistorySchema);
