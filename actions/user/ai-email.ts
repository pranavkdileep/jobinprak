"use server";

import { connectToDatabase } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import OpenAI from "openai";

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

export async function generateApplicationEmail(jobId: string) {
  const session = await getUserFromSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const db = await connectToDatabase();
    const userId = new ObjectId(session.userId as string);
    const [user, job] = await Promise.all([
      db.collection("users").findOne(
        { _id: userId },
        {
          projection: {
            firstName: 1,
            lastName: 1,
            email: 1,
            phone: 1,
            skills: 1,
            summary: 1,
            experience: 1,
            education: 1,
            certifications: 1,
            jobDomain: 1,
          },
        }
      ),
      db.collection("jobs").findOne({ _id: new ObjectId(jobId) }),
    ]);

    if (!user) return { error: "User not found" };
    if (!job) return { error: "Job not found" };

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { error: "OPENAI_API_KEY not configured" };
    }

    const openai = new OpenAI({
      apiKey,
      baseURL: process.env.OPENAI_BASE_URL || undefined,
    });

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const prompt = `You are a professional email writer. Generate a short job application email in JSON format with "subject" and "body" fields.

Job Details:
- Title: ${job.job_title}
- Company: ${job.company_name}
- Description: ${job.details?.small_description || "N/A"}
- Skills required: ${(job.details?.skill_set || []).join(", ")}
- Responsibilities: ${(job.details?.responsibilities || []).join(", ")}

Applicant Profile:
- Name: ${user.firstName} ${user.lastName}
- Email: ${user.email}
- Domain: ${user.jobDomain || "N/A"}
- Skills: ${(user.skills || []).join(", ")}
- Summary: ${user.summary || "N/A"}
- Experience: ${(user.experience || []).map((e: { position: string; company: string }) => `${e.position} at ${e.company}`).join("; ") || "N/A"}
- Education: ${(user.education || []).map((e: { degree: string; institution: string }) => `${e.degree} from ${e.institution}`).join("; ") || "N/A"}
- Certifications: ${(user.certifications || []).join(", ") || "N/A"}


The body should be concise (2-3 short paragraphs), professional, and highlight relevant skills. Respond with valid JSON only, no markdown.`;

    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return { error: "AI failed to generate email" };
    }

    const result = JSON.parse(content) as { subject: string; body: string };
    return {
      success: true,
      subject: result.subject,
      body: result.body,
    };
  } catch (err) {
    return {
      error: `Failed to generate email: ${err instanceof Error ? err.message : "Unknown error"}`,
    };
  }
}
