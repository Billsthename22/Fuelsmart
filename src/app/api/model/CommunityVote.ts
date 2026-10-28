import mongoose, { Schema } from "mongoose";

if (process.env.NODE_ENV === "development" && mongoose.models.CommunityVote) delete mongoose.models.CommunityVote;

const CommunityVoteSchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: "CommunityPost", required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  value: { type: String, enum: ["ACCURATE", "OUTDATED"], required: true },
}, { timestamps: true });

CommunityVoteSchema.index({ postId: 1, userId: 1 }, { unique: true });

export default mongoose.models.CommunityVote || mongoose.model("CommunityVote", CommunityVoteSchema);
