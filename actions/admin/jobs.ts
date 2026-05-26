"use server";

import { connectToDatabase } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { start } from "workflow/api";
import { sendJobNotificationsWorkflow } from "@/workflows/job-notification";
import type { Job } from "@/types/jobs";

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

interface ListJobsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function listJobs(params: ListJobsParams) {
  try {
    await verifyAdmin();
  } catch {
    return { error: "Unauthorized" };
  }

  const { page = 1, limit = 10, search } = params;
  const skip = (page - 1) * limit;

  try {
    const db = await connectToDatabase();
    const query: Record<string, unknown> = {};

    if (search) {
      const regex = { $regex: search, $options: "i" };
      query.$or = [
        { job_title: regex },
        { company_name: regex },
        { source: regex },
        { "details.small_description": regex },
        { "details.skill_set": regex },
      ];
    }

    const [jobs, total] = await Promise.all([
      db
        .collection("jobs")
        .find(query)
        .sort({ posted_date: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("jobs").countDocuments(query),
    ]);

    return {
      jobs: jobs.map((j) => ({ ...j, _id: j._id.toString() })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch {
    return { error: "Failed to fetch jobs" };
  }
}

export async function getJob(jobId: string) {
  try {
    await verifyAdmin();
  } catch {
    return { error: "Unauthorized" };
  }

  try {
    const db = await connectToDatabase();
    const job = await db.collection("jobs").findOne({ _id: new ObjectId(jobId) });
    if (!job) return { error: "Job not found" };
    return { job: { ...job, _id: job._id.toString() } };
  } catch {
    return { error: "Failed to fetch job" };
  }
}

export async function createJob(data: Omit<Job, "_id">) {
  try {
    await verifyAdmin();
  } catch {
    return { error: "Unauthorized" };
  }

  try {
    const db = await connectToDatabase();
    const result = await db.collection("jobs").insertOne(data);
    return { success: true, id: result.insertedId.toString() };
  } catch {
    return { error: "Failed to create job" };
  }
}

export async function updateJob(jobId: string, data: Partial<Job>) {
  try {
    await verifyAdmin();
  } catch {
    return { error: "Unauthorized" };
  }

  delete (data as Record<string, unknown>)._id;

  try {
    const db = await connectToDatabase();
    const result = await db
      .collection("jobs")
      .updateOne({ _id: new ObjectId(jobId) }, { $set: data });

    if (result.matchedCount === 0) {
      return { error: "Job not found" };
    }

    return { success: true };
  } catch {
    return { error: "Failed to update job" };
  }
}

export async function bulkUpload(formData: FormData) {
  try {
    await verifyAdmin();
  } catch {
    return { error: "Unauthorized" };
  }

  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };

  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const jobs: Omit<Job, "_id">[] = parsed.jobs ?? parsed;

    if (!Array.isArray(jobs) || jobs.length === 0) {
      return { error: "No jobs found in file" };
    }

    const db = await connectToDatabase();
    const existingIds = new Set(
      (
        await db
          .collection("jobs")
          .find(
            { job_id: { $in: jobs.map((j) => j.job_id) } },
            { projection: { job_id: 1 } }
          )
          .toArray()
      ).map((j) => j.job_id)
    );

    const toInsert = jobs.filter((j) => !existingIds.has(j.job_id));

    if (toInsert.length > 0) {
      await db.collection("jobs").insertMany(toInsert);
    }

    return {
      success: true,
      inserted: toInsert.length,
      skipped: jobs.length - toInsert.length,
      total: jobs.length,
    };
  } catch {
    return { error: "Failed to parse or import file" };
  }
}

export async function bulkUploadFromRestApi(auth: { username: string; password: string }, data: Omit<Job, "_id">[]) {
  try {
    const db = await connectToDatabase();
    const admin = await db
      .collection("admin")
      .findOne({ username: auth.username });

    if (!admin || auth.password !== admin.password) {
      return { error: "Invalid credentials" };
    }
  } catch {
    return { error: "Authentication failed" };
  }

  if (!Array.isArray(data) || data.length === 0) {
    return { error: "No jobs provided" };
  }

  try {
    const db = await connectToDatabase();
    const existingIds = new Set(
      (
        await db
          .collection("jobs")
          .find(
            { job_id: { $in: data.map((j) => j.job_id) } },
            { projection: { job_id: 1 } }
          )
          .toArray()
      ).map((j) => j.job_id)
    );

    const toInsert = data.filter((j) => !existingIds.has(j.job_id));

    if (toInsert.length > 0) {
      await db.collection("jobs").insertMany(toInsert);
    }

    return {
      success: true,
      inserted: toInsert.length,
      skipped: data.length - toInsert.length,
      total: data.length,
    };
  } catch {
    return { error: "Failed to import jobs" };
  }
}

export async function cleanExpiredJobs() {
  try {
    await verifyAdmin();
  } catch {
    return { error: "Unauthorized" };
  }

  try {
    const db = await connectToDatabase();
    const today = new Date().toISOString().slice(0, 10);

    const result = await db
      .collection("jobs")
      .deleteMany({ closing_date: { $lt: today } });

    return {
      success: true,
      deletedCount: result.deletedCount,
      message: `Cleaned up ${result.deletedCount} expired job(s)`,
    };
  } catch {
    return { error: "Failed to clean expired jobs" };
  }
}

export async function deleteJob(jobId: string) {
  try {
    await verifyAdmin();
  } catch {
    return { error: "Unauthorized" };
  }

  try {
    const db = await connectToDatabase();
    const result = await db.collection("jobs").deleteOne({ _id: new ObjectId(jobId) });

    if (result.deletedCount === 0) {
      return { error: "Job not found" };
    }

    return { success: true };
  } catch {
    return { error: "Failed to delete job" };
  }
}

export async function startJobNotifications() {
  try {
    await verifyAdmin();
  } catch {
    return { error: "Unauthorized" };
  }

  try {
    const run = await start(sendJobNotificationsWorkflow, []);
    return {
      success: true,
      runId: run.runId,
      message: "Job notification workflow started",
    };
  } catch {
    return { error: "Failed to start job notification workflow" };
  }
}
