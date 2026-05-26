"use server";

import { connectToDatabase } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import OpenAI from "openai";
import { logAiUsage } from "@/actions/admin/analatics";

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

//     const prompt = `You are a professional email writer. Generate a short job application email in JSON format with "subject" and "body" fields.

// Job Details:
// - Title: ${job.job_title}
// - Company: ${job.company_name}
// - Description: ${job.details?.small_description || "N/A"}
// - Skills required: ${(job.details?.skill_set || []).join(", ")}
// - Responsibilities: ${(job.details?.responsibilities || []).join(", ")}

// Applicant Profile:
// - Name: ${user.firstName} ${user.lastName}
// - Email: ${user.email}
// - Projects and Details: ${(user.projects || []).map((p: { name: string; description: string; technologies: string[]; url?: string }) => `${p.name} (${p.description}) using ${p.technologies.join(", ")}${p.url ? ` - ${p.url}` : ""}`).join("; ") || "N/A"}
// - Skills: ${(user.skills || []).join(", ")}
// - Summary: ${user.summary || "N/A"}
// - Experience: ${(user.experience || []).map((e: { position: string; company: string }) => `${e.position} at ${e.company}`).join("; ") || "N/A"}
// - Education: ${(user.education || []).map((e: { degree: string; institution: string }) => `${e.degree} from ${e.institution}`).join("; ") || "N/A"}
// - Certifications: ${(user.certifications || []).join(", ") || "N/A"}
// - SocialLinks : ${JSON.stringify(user.socialLinks || {})}
// - phone: ${user.phone || "N/A"}



// The body should be concise (2-3 short paragraphs), professional, highlight relevant skills and write that resume attached to this email . Respond with valid JSON only, no markdown.`;
    const prompt = `You are a professional job application email writer. Generate a job application email as JSON with "subject" and "body" fields.

STRICT RULES:
- Body must be exactly 3 short paragraphs, no bullet points, no lists
- Paragraph 1: State the role and company, and mention the applicant's degree and graduation status (they are a GRADUATE, not a student)
- Paragraph 2: Pick the 1-2 most RELEVANT projects or skills from the applicant's profile that directly match the job's required skills or responsibilities. Be specific — mention project names and what they demonstrate. Do NOT list all skills generically.
- Paragraph 3: Express genuine interest in the specific tech stack of this role, mention resume is attached, and invite a conversation
- Closing: Name, phone, email, and any relevant social links (LinkedIn, GitHub)
- Tone: Confident, concise, human — NOT corporate boilerplate
- Subject line format: "Application for [Job Title] – [Full Name]"
- Respond with valid JSON only. No markdown, no backticks, no preamble.

Job Details:
- Title: ${job.job_title}
- Company: ${job.company_name}
- Description: ${job.details?.small_description || "N/A"}
- Skills required: ${(job.details?.skill_set || []).join(", ")}
- Responsibilities: ${(job.details?.responsibilities || []).join(", ")}

Applicant Profile:
- Name: ${user.firstName} ${user.lastName}
- Email: ${user.email}
- Phone: ${user.phone || "N/A"}
- Summary: ${user.summary || "N/A"}
- Education: ${(user.education || []).map((e: { degree: string; institution: string }) => `${e.degree} from ${e.institution}`).join("; ") || "N/A"}
- Experience: ${(user.experience || []).map((e: { position: string; company: string }) => `${e.position} at ${e.company}`).join("; ") || "N/A"}
- Skills: ${(user.skills || []).join(", ")}
- Projects: ${(user.projects || []).map((p: { name: string; description: string; technologies: string[]; url?: string }) => `${p.name}: ${p.description} (Tech: ${p.technologies.join(", ")})${p.url ? ` — ${p.url}` : ""}`).join(" | ") || "N/A"}
- Certifications: ${(user.certifications || []).join(", ") || "N/A"}
- Social Links: ${JSON.stringify(user.socialLinks || {})}

Expected JSON format:
{
  "subject": "Application for [Job Title] – [Full Name]",
  "body": "full email body as a single string with \\n\\n between paragraphs"
}`;
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
    const tokensUsed = completion.usage?.total_tokens ?? 0;
    await logAiUsage(session.userId as string, tokensUsed);
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
