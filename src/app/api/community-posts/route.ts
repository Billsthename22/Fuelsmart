import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/api/lib/mongodb";
import { readSession, requireRoles } from "@/app/api/lib/auth";
import CommunityPost from "@/app/api/model/CommunityPost";
import CommunityVoteModel from "@/app/api/model/CommunityVote";
import Station from "@/app/api/model/Station";
import "@/app/api/model/User";
import { COMMUNITY_CATEGORIES, CommunityCategory, CommunityPostSummary, CommunityVote, parseCommunityPost } from "@/app/lib/community";

type StoredPost = {
  _id: { toString(): string }; category: CommunityCategory; fuelType?: "PMS" | "DIESEL" | "LPG" | "CNG" | null; message: string; reportedPrice?: number | null;
  createdAt: Date; expiresAt: Date;
  authorId: { _id: { toString(): string }; username: string };
  stationKey: string;
  station: { brand: string; branchName: string; address: string; verified: boolean };
};
type VoteCount = { _id: { postId: { toString(): string }; value: CommunityVote }; count: number };
type UserVote = { postId: { toString(): string }; value: CommunityVote };

export async function GET(request: NextRequest) {
  await connectDB();
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const stationKey = url.searchParams.get("stationKey") || url.searchParams.get("stationId");
  const filters: Record<string, unknown> = { hidden: false, expiresAt: { $gt: new Date() } };
  if (category && COMMUNITY_CATEGORIES.includes(category as CommunityCategory)) filters.category = category;
  if (stationKey) filters.stationKey = stationKey;
  const posts = await CommunityPost.find(filters).sort({ createdAt: -1 }).limit(50).populate("authorId", "username").lean() as unknown as StoredPost[];
  const postIds = posts.map((post) => post._id);
  const counts = postIds.length ? await CommunityVoteModel.aggregate<VoteCount>([{ $match: { postId: { $in: postIds } } }, { $group: { _id: { postId: "$postId", value: "$value" }, count: { $sum: 1 } } }]) : [];
  const session = readSession(request);
  const mine = session && postIds.length ? await CommunityVoteModel.find({ postId: { $in: postIds }, userId: session.userId }).select("postId value").lean() as unknown as UserVote[] : [];
  const summaries = posts.filter((post) => post.authorId && post.station).map((post): CommunityPostSummary => {
    const id = post._id.toString();
    const count = (value: CommunityVote) => counts.find((item) => item._id.postId.toString() === id && item._id.value === value)?.count || 0;
    return { _id: id, category: post.category, fuelType: post.fuelType ?? null, message: post.message, reportedPrice: post.reportedPrice ?? null, createdAt: post.createdAt.toISOString(), expiresAt: post.expiresAt.toISOString(), author: { _id: post.authorId._id.toString(), username: post.authorId.username }, station: { _id: post.stationKey, brand: post.station.brand, branchName: post.station.branchName, address: post.station.address, verified: post.station.verified }, votes: { accurate: count("ACCURATE"), outdated: count("OUTDATED"), mine: mine.find((vote) => vote.postId.toString() === id)?.value || null } };
  });
  return NextResponse.json({ posts: summaries });
}

export async function POST(request: NextRequest) {
  const session = requireRoles(request, ["DRIVER"]);
  if (!session) return NextResponse.json({ error: "Log in with a driver account to post an update." }, { status: 401 });
  const body = await request.json();
  const parsed = parseCommunityPost(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  await connectDB();
  let stationId: mongoose.Types.ObjectId | null = null;
  let stationKey = parsed.value.stationId;
  let stationSnapshot: { brand: string; branchName: string; address: string; verified: boolean; coordinates: { lat: number; lng: number } };
  if (stationKey.startsWith("google:")) {
    const supplied = body.station as Record<string, unknown> | undefined;
    const coordinates = supplied?.coordinates as { lat?: unknown; lng?: unknown } | undefined;
    if (!/^google:[A-Za-z0-9_-]{3,}$/.test(stationKey) || typeof supplied?.brand !== "string" || typeof supplied.address !== "string" || !Number.isFinite(coordinates?.lat) || !Number.isFinite(coordinates?.lng)) return NextResponse.json({ error: "Select a valid nearby station." }, { status: 400 });
    stationSnapshot = { brand: supplied.brand.trim().slice(0, 120), branchName: typeof supplied.branchName === "string" ? supplied.branchName.trim().slice(0, 120) : "", address: supplied.address.trim().slice(0, 240), verified: false, coordinates: { lat: Number(coordinates?.lat), lng: Number(coordinates?.lng) } };
  } else {
    if (!mongoose.isValidObjectId(stationKey)) return NextResponse.json({ error: "Select a valid fuel station." }, { status: 400 });
    const station = await Station.findOne({ _id: stationKey, verified: true }).select("brand branchName address location verified").lean() as unknown as { _id: mongoose.Types.ObjectId; brand: string; branchName: string; address: string; verified: boolean; location: { coordinates: number[] } } | null;
    if (!station) return NextResponse.json({ error: "That verified fuel station is no longer available." }, { status: 404 });
    stationId = station._id; stationKey = station._id.toString();
    stationSnapshot = { brand: station.brand, branchName: station.branchName, address: station.address, verified: true, coordinates: { lat: station.location.coordinates[1], lng: station.location.coordinates[0] } };
  }
  const duplicate = await CommunityPost.exists({ authorId: session.userId, stationKey, category: parsed.value.category, createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) }, hidden: false });
  if (duplicate) return NextResponse.json({ error: "You recently posted this update for the same station. Please wait before posting it again." }, { status: 409 });
  const post = await CommunityPost.create({ authorId: session.userId, stationKey, stationId, station: stationSnapshot, category: parsed.value.category, fuelType: parsed.value.fuelType, message: parsed.value.message, reportedPrice: parsed.value.reportedPrice, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) });
  return NextResponse.json({ postId: post.id }, { status: 201 });
}
