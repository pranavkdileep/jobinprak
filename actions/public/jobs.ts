"use server";

import { connectToDatabase } from "@/lib/db";

export interface PublicJobsParams {
  page?: number;
  limit?: number;
  keyword?: string;
  source?: string;
  skill_set?: string;
  min_experience?: number;
  max_experience?: number;
  sort?: "posted_date" | "closing_date" | "experience_asc" | "experience_desc";
}

export async function listPublicJobs(params: PublicJobsParams) {
  const { page = 1, limit = 20, keyword, source, skill_set, min_experience, max_experience, sort = "posted_date" } = params;
  const skip = (page - 1) * limit;

  try {
    const db = await connectToDatabase();
    const query: Record<string, unknown> = {};
    const and: Record<string, unknown>[] = [];

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
    };
  } catch {
    return { error: "Failed to fetch jobs" };
  }
}
