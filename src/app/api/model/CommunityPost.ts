import mongoose, { Schema } from "mongoose";
import { COMMUNITY_CATEGORIES } from "@/app/lib/community";

if (process.env.NODE_ENV === "development" && mongoose.models.CommunityPost) delete mongoose.models.CommunityPost;

const CommunityPostSchema = new Schema({
  authorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  stationKey: { type: String, required: true, index: true },
  stationId: { type: Schema.Types.ObjectId, ref: "Station", default: null, index: true },
  station: {
    brand: { type: String, required: true, trim: true },
    branchName: { type: String, default: "", trim: true },
    address: { type: String, required: true, trim: true },
    verified: { type: Boolean, required: true },
    coordinates: { lat: { type: Number, required: true }, lng: { type: Number, required: true } },
  },
  category: { type: String, enum: COMMUNITY_CATEGORIES, required: true, index: true },
  fuelType: { type: String, enum: ["PMS", "DIESEL", "LPG", "CNG"], default: null },
  message: { type: String, trim: true, maxlength: 280, default: "" },
  reportedPrice: { type: Number, min: 0, default: null },
  expiresAt: { type: Date, required: true, index: true },
  hidden: { type: Boolean, default: false, index: true },
}, { timestamps: true });

CommunityPostSchema.index({ expiresAt: -1, createdAt: -1 });
CommunityPostSchema.index({ stationKey: 1, createdAt: -1 });

export default mongoose.models.CommunityPost || mongoose.model("CommunityPost", CommunityPostSchema);
