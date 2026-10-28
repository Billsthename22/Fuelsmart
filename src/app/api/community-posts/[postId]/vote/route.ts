import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/api/lib/mongodb";
import { requireRoles } from "@/app/api/lib/auth";
import CommunityPost from "@/app/api/model/CommunityPost";
import CommunityVote from "@/app/api/model/CommunityVote";
import { parseCommunityVote } from "@/app/lib/community";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  const session = requireRoles(request, ["DRIVER"]);
  if (!session) return NextResponse.json({ error: "Log in with a driver account to vote." }, { status: 401 });
  const { postId } = await params;
  if (!mongoose.isValidObjectId(postId)) return NextResponse.json({ error: "Community update not found." }, { status: 404 });
  const parsed = parseCommunityVote((await request.json()).value);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  await connectDB();
  const post = await CommunityPost.findOne({ _id: postId, hidden: false, expiresAt: { $gt: new Date() } }).select("_id");
  if (!post) return NextResponse.json({ error: "This community update has expired." }, { status: 410 });
  await CommunityVote.findOneAndUpdate({ postId, userId: session.userId }, { value: parsed.value }, { upsert: true, new: true, runValidators: true });
  const counts = await CommunityVote.aggregate<{ _id: string; count: number }>([{ $match: { postId: post._id } }, { $group: { _id: "$value", count: { $sum: 1 } } }]);
  return NextResponse.json({ votes: { accurate: counts.find((item) => item._id === "ACCURATE")?.count || 0, outdated: counts.find((item) => item._id === "OUTDATED")?.count || 0, mine: parsed.value } });
}
