"use server";

import { connectToDatabase } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import type { PublicJobsParams } from "@/actions/public/jobs";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-in-production"
);

async function getUserFromSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export interface UserJobsParams extends PublicJobsParams {
  showAll?: boolean;
}

export async function listUserJobs(params: UserJobsParams) {
  const { page = 1, limit = 20, keyword, source, skill_set, min_experience, max_experience, sort = "posted_date", showAll = false } = params;
  const skip = (page - 1) * limit;

  try {
    const session = await getUserFromSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    const db = await connectToDatabase();
    const user = await db.collection("users").findOne({ _id: new ObjectId(session.userId as string) });

    if (!user) {
      return { error: "User not found" };
    }

    const query: Record<string, unknown> = {};
    const and: Record<string, unknown>[] = [];

    if (!showAll && user.skills && user.skills.length > 0) {
      const skillRegex = user.skills.map((skill: string) => ({
        "details.skill_set": { $regex: skill, $options: "i" },
      }));
      and.push({ $or: skillRegex });
    }

    if (keyword) {
      const regex = { $regex: keyword, $options: "i" };
      and.push({
        $or: [
          { job_title: regex },
          { company_name: regex },
          { "details.small_description": regex },
        ],
      });
    }

    if (source) {
      and.push({ source: { $regex: source, $options: "i" } });
    }

    if (skill_set) {
      and.push({
        "details.skill_set": { $regex: skill_set, $options: "i" },
      });
    }

    if (min_experience !== undefined) {
      and.push({ "details.max_experience": { $gte: min_experience } });
    }

    if (max_experience !== undefined) {
      and.push({ "details.min_experience": { $lte: max_experience } });
    }

    if (and.length > 0) {
      query.$and = and;
    }

    let sortQuery: Record<string, 1 | -1>;
    switch (sort) {
      case "closing_date":
        sortQuery = { closing_date: 1 };
        break;
      case "experience_asc":
        sortQuery = { "details.min_experience": 1 };
        break;
      case "experience_desc":
        sortQuery = { "details.min_experience": -1 };
        break;
      default:
        sortQuery = { posted_date: -1 };
    }

    const [jobs, total] = await Promise.all([
      db
        .collection("jobs")
        .find(query)
        .project({ _id: 0 })
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("jobs").countDocuments(query),
    ]);

    return {
      jobs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      showAll,
    };
  } catch {
    return { error: "Failed to fetch jobs" };
  }
}
