"use server";

import { connectToDatabase } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-in-production"
);

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("adminJwt")?.value;
  if (!token) throw new Error("Unauthorized");

  const { payload } = await jwtVerify(token, secret);
  if (payload.role !== "admin") throw new Error("Forbidden");
}

export async function logAiUsage(
  userId: string,
  tokensUsed: number
) {
  try {
    const db = await connectToDatabase();
    await db.collection("usage").updateOne(
      { userId },
      {
        $inc: {
          totalTokens: tokensUsed,
          totalEmailGenerations: 1,
        },
        $setOnInsert: { userId },
      },
      { upsert: true }
    );
  } catch {
    console.error("Failed to log AI usage");
  }
}

export interface AnalyticsData {
  totalUsers: number;
  totalEmailGenerations: number;
  overallTokens: number;
  latestUsers: {
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    createdAt?: string;
  }[];
  topUsers: {
    userId: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    totalEmailGenerations: number;
    totalTokens: number;
  }[];
}

export async function getAnalytics(): Promise<AnalyticsData | { error: string }> {
  try {
    await verifyAdmin();
  } catch {
    return { error: "Unauthorized" };
  }

  const db = await connectToDatabase();

  const [totalUsers, usageAgg, latestUsers, topUsers] = await Promise.all([
    db.collection("users").countDocuments(),
    db
      .collection("usage")
      .aggregate([
        {
          $group: {
            _id: null,
            totalEmailGenerations: { $sum: "$totalEmailGenerations" },
            overallTokens: { $sum: "$totalTokens" },
          },
        },
      ])
      .toArray(),
    db
      .collection("users")
      .find({}, { projection: { email: 1, firstName: 1, lastName: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray(),
    db
      .collection("usage")
      .aggregate([
        { $sort: { totalEmailGenerations: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "users",
            let: { usageUserId: "$userId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: [{ $toString: "$_id" }, "$$usageUserId"] },
                },
              },
              { $project: { email: 1, firstName: 1, lastName: 1 } },
            ],
            as: "user",
          },
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      ])
      .toArray(),
  ]);

  const aggregated = usageAgg[0] || { totalEmailGenerations: 0, overallTokens: 0 };

  return {
    totalUsers,
    totalEmailGenerations: aggregated.totalEmailGenerations,
    overallTokens: aggregated.overallTokens,
    latestUsers: latestUsers.map((u) => ({
      _id: u._id.toString(),
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : undefined,
    })),
    topUsers: topUsers.map((u) => ({
      userId: u.userId,
      email: u.user?.email,
      firstName: u.user?.firstName,
      lastName: u.user?.lastName,
      totalEmailGenerations: u.totalEmailGenerations || 0,
      totalTokens: u.totalTokens || 0,
    })),
  };
}
