"use server";

import { connectToDatabase } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { start } from "workflow/api";
import { sendVerificationEmailWorkflow } from "@/workflows/user-auth";

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

export async function updateNotificationSettings(data: {
  newJob?: boolean;
  newsletter?: boolean;
  promotions?: boolean;
}) {
  try {
    const session = await getUserFromSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    const db = await connectToDatabase();
    const userId = new ObjectId(session.userId as string);

    const updateFields: Record<string, boolean> = {};
    if (data.newJob !== undefined)
      updateFields["notificationSettings.newJob"] = data.newJob;
    if (data.newsletter !== undefined)
      updateFields["notificationSettings.newsletter"] = data.newsletter;
    if (data.promotions !== undefined)
      updateFields["notificationSettings.promotions"] = data.promotions;

    await db.collection("users").updateOne(
      { _id: userId },
      { $set: { ...updateFields, updatedAt: new Date() } }
    );

    return { success: true, message: "Notification settings updated" };
  } catch {
    return { error: "Failed to update notification settings" };
  }
}

export async function updateWhatsAppNumber(whatsappNumber: string) {
  try {
    const session = await getUserFromSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    const db = await connectToDatabase();
    const userId = new ObjectId(session.userId as string);

    await db.collection("users").updateOne(
      { _id: userId },
      { $set: { whatsappNumber, updatedAt: new Date() } }
    );

    return { success: true, message: "WhatsApp number updated" };
  } catch {
    return { error: "Failed to update WhatsApp number" };
  }
}

export async function updateTelegramNumber(telegramNumber: string) {
  try {
    const session = await getUserFromSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    const db = await connectToDatabase();
    const userId = new ObjectId(session.userId as string);

    await db.collection("users").updateOne(
      { _id: userId },
      { $set: { telegramNumber, updatedAt: new Date() } }
    );

    return { success: true, message: "Telegram number updated" };
  } catch {
    return { error: "Failed to update Telegram number" };
  }
}

export async function toggleWhatsAppNotification(enabled: boolean) {
  try {
    const session = await getUserFromSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    const db = await connectToDatabase();
    const userId = new ObjectId(session.userId as string);

    await db.collection("users").updateOne(
      { _id: userId },
      { $set: { whatsappNotification: enabled, updatedAt: new Date() } }
    );

    return {
      success: true,
      message: `WhatsApp notification ${enabled ? "enabled" : "disabled"}`,
    };
  } catch {
    return { error: "Failed to toggle WhatsApp notification" };
  }
}

export async function toggleTelegramNotification(enabled: boolean) {
  try {
    const session = await getUserFromSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    const db = await connectToDatabase();
    const userId = new ObjectId(session.userId as string);

    await db.collection("users").updateOne(
      { _id: userId },
      { $set: { telegramNotification: enabled, updatedAt: new Date() } }
    );

    return {
      success: true,
      message: `Telegram notification ${enabled ? "enabled" : "disabled"}`,
    };
  } catch {
    return { error: "Failed to toggle Telegram notification" };
  }
}

export async function resendVerificationEmail() {
  try {
    const session = await getUserFromSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    const db = await connectToDatabase();
    const userId = new ObjectId(session.userId as string);

    const user = await db.collection("users").findOne({ _id: userId });
    if (!user) {
      return { error: "User not found" };
    }

    if (user.isVerified) {
      return { error: "Email is already verified" };
    }

    await start(sendVerificationEmailWorkflow, [
      session.userId as string,
      user.email,
    ]);

    return { success: true, message: "Verification email sent" };
  } catch {
    return { error: "Failed to resend verification email" };
  }
}
