import { connectToDatabase } from "@/lib/db";
import { sendJobNotificationEmail } from "@/actions/email/email-services";
import { sendTelegramMessage } from "@/actions/telegram/send";
import { sendWhatsAppMessage } from "@/actions/whatsapp/send";
import type { NotificationChannel, NotificationStatus } from "@/types/notifications";

interface UserRecord {
  _id: string;
  email: string;
  skills: string[];
  jobDomain: string;
  telegramNumber?: string;
  whatsappNumber?: string;
  telegramNotification: boolean;
  whatsappNotification: boolean;
}

interface JobRecord {
  _id: string;
  job_title: string;
  company_name: string;
  closing_date: string;
  details: {
    small_description: string;
    skill_set: string[];
    min_experience: number;
    max_experience: number;
  };
}

export async function sendJobNotificationsWorkflow() {
  "use workflow";

  const users = await fetchUsersWithNotifications();
  const jobs = await fetchActiveJobs();

  const summary: { userId: string; count: number }[] = [];

  for (const user of users) {
    const matchedJobs = findMatchingJobs(user, jobs);
    if (matchedJobs.length === 0) continue;

    const newMatches: JobRecord[] = [];

    for (const job of matchedJobs) {
      const exists = await checkDuplicateNotification(user._id, job._id);
      if (exists) continue;
      newMatches.push(job);
    }

    if (newMatches.length === 0) continue;

    await sendAndRecordNotifications(user, newMatches);
    summary.push({ userId: user._id, count: newMatches.length });
  }

  return {
    usersNotified: summary.length,
    totalNotificationsSent: summary.reduce((acc, s) => acc + s.count, 0),
    details: summary,
  };
}

async function fetchUsersWithNotifications(): Promise<UserRecord[]> {
  "use step";

  const db = await connectToDatabase();
  const users = await db
    .collection("users")
    .find({
      isVerified: { $ne: false },
      "notificationSettings.newJob": { $ne: false },
    })
    .project({
      _id: 1,
      email: 1,
      skills: 1,
      jobDomain: 1,
      telegramNumber: 1,
      whatsappNumber: 1,
      telegramNotification: 1,
      whatsappNotification: 1,
    })
    .toArray();

  return users.map((u) => ({
    ...u,
    _id: u._id.toString(),
  })) as UserRecord[];
}

async function fetchActiveJobs(): Promise<JobRecord[]> {
  "use step";

  const db = await connectToDatabase();
  const today = new Date().toISOString().slice(0, 10);

  const jobs = await db
    .collection("jobs")
    .find({ closing_date: { $gte: today } })
    .project({
      _id: 1,
      job_title: 1,
      company_name: 1,
      closing_date: 1,
      "details.small_description": 1,
      "details.skill_set": 1,
      "details.min_experience": 1,
      "details.max_experience": 1,
    })
    .toArray();

  return jobs.map((j) => ({
    ...j,
    _id: j._id.toString(),
  })) as JobRecord[];
}

function findMatchingJobs(user: UserRecord, jobs: JobRecord[]): JobRecord[] {
  const userSkills = user.skills.map((s) => s.toLowerCase());
  const userDomain = user.jobDomain.toLowerCase();

  return jobs.filter((job) => {
    const title = job.job_title.toLowerCase();
    const desc = job.details.small_description.toLowerCase();
    const jobSkills = job.details.skill_set.map((s) => s.toLowerCase());

    const domainMatch = title.includes(userDomain) || desc.includes(userDomain);

    const skillOverlap = jobSkills.some((s) => userSkills.includes(s));

    return domainMatch || skillOverlap;
  });
}

async function checkDuplicateNotification(
  userId: string,
  jobId: string
): Promise<boolean> {
  "use step";

  const db = await connectToDatabase();
  const existing = await db.collection("notifications").findOne({
    userId,
    jobId,
  });
  return existing !== null;
}

async function sendAndRecordNotifications(
  user: UserRecord,
  jobs: JobRecord[]
): Promise<void> {
  "use step";

  const db = await connectToDatabase();
  const now = new Date();

  const jobData = jobs.map((job) => ({
    job_title: job.job_title,
    company_name: job.company_name,
    details: {
      small_description: job.details.small_description,
      skill_set: job.details.skill_set,
      min_experience: job.details.min_experience,
      max_experience: job.details.max_experience,
    },
  }));

  const channels: { channel: NotificationChannel; send: () => Promise<{ success: boolean }> }[] = [];

  channels.push({
    channel: "email",
    send: () => sendJobNotificationEmail(user.email, jobData),
  });

  if (user.telegramNotification && user.telegramNumber) {
    const chatId = user.telegramNumber;
    const message = jobs
      .map(
        (job) =>
          `🔹 <b>${job.job_title}</b>\n🏢 ${job.company_name}\n📝 ${job.details.small_description.slice(0, 200)}`
      )
      .join("\n\n") + `\n\n<a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dash">View all jobs</a>`;

    channels.push({
      channel: "telegram",
      send: () => sendTelegramMessage(chatId, message),
    });
  }

  if (user.whatsappNotification && user.whatsappNumber) {
    const phone = user.whatsappNumber;
    const message = jobs
      .map(
        (job) =>
          `🔹 ${job.job_title}\n🏢 ${job.company_name}\n📝 ${job.details.small_description.slice(0, 200)}`
      )
      .join("\n\n") + `\n\nView all jobs: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dash`;

    channels.push({
      channel: "whatsapp",
      send: () => sendWhatsAppMessage(phone, message),
    });
  }

  const records: {
    userId: string;
    jobId: string;
    jobTitle: string;
    companyName: string;
    channel: NotificationChannel;
    message: string;
    status: NotificationStatus;
    sentAt: Date;
    createdAt: Date;
  }[] = [];

  for (const entry of channels) {
    const result = await entry.send();
    for (const job of jobs) {
      records.push({
        userId: user._id,
        jobId: job._id,
        jobTitle: job.job_title,
        companyName: job.company_name,
        channel: entry.channel,
        message: `${job.job_title} at ${job.company_name}`,
        status: result.success ? "sent" : "failed" as NotificationStatus,
        sentAt: now,
        createdAt: now,
      });
    }
  }

  if (records.length > 0) {
    await db.collection("notifications").insertMany(records);
  }
}
