"use server";

import { connectToDatabase } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { encrypt, decrypt } from "@/actions/encription/aes";

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

export async function isGmailConnected(): Promise<boolean> {
  const session = await getUserFromSession();
  if (!session) return false;

  const db = await connectToDatabase();
  const user = await db.collection("users").findOne(
    { _id: new ObjectId(session.userId as string) },
    { projection: { googleRefreshToken: 1 } }
  );

  return !!user?.googleRefreshToken;
}

export async function sendViaGmail(formData: FormData) {
  const session = await getUserFromSession();
  if (!session) return { error: "Unauthorized" };

  const to = formData.get("to") as string;
  const subject = formData.get("subject") as string;
  const body = formData.get("body") as string;
  const file = formData.get("resume") as File | null;

  if (!to || !subject || !body) return { error: "Missing required fields" };

  try {
    const db = await connectToDatabase();
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(session.userId as string) },
      { projection: { googleAccessToken: 1, googleRefreshToken: 1, googleExpiryDate: 1, email: 1, firstName: 1, lastName: 1 } }
    );

    if (!user?.googleRefreshToken) return { error: "Gmail not connected" };

    const accessToken = decrypt(user.googleAccessToken);
    const refreshToken = decrypt(user.googleRefreshToken);

    const boundary = `boundary${Date.now()}`;
    const lines: string[] = [];

    lines.push(`From: "${user.firstName} ${user.lastName}" <${user.email}>`);
    lines.push(`To: ${to}`);
    lines.push(`Subject: ${subject}`);
    lines.push("MIME-Version: 1.0");
    lines.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
    lines.push("");

    lines.push(`--${boundary}`);
    lines.push('Content-Type: text/plain; charset=UTF-8');
    lines.push("Content-Transfer-Encoding: base64");
    lines.push("");
    lines.push(Buffer.from(body, "utf-8").toString("base64"));
    lines.push("");

    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const fileBase64 = Buffer.from(arrayBuffer).toString("base64");
      const mimeType = file.type || "application/octet-stream";

      lines.push(`--${boundary}`);
      lines.push(`Content-Type: ${mimeType}`);
      lines.push("Content-Transfer-Encoding: base64");
      lines.push(`Content-Disposition: attachment; filename="${file.name}"`);
      lines.push("");
      lines.push(fileBase64);
      lines.push("");
    }

    lines.push(`--${boundary}--`);

    const raw = Buffer.from(lines.join("\r\n"), "utf-8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!tokenRes.ok) {
      return { error: "Failed to refresh Google token" };
    }

    const { access_token } = await tokenRes.json();

    const gmailRes = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw }),
      }
    );

    if (!gmailRes.ok) {
      const errText = await gmailRes.text();
      if (gmailRes.status === 401) {
        await db.collection("users").updateOne(
          { _id: user._id },
          { $unset: { googleAccessToken: "", googleRefreshToken: "", googleExpiryDate: "" } }
        );
        return { error: "Gmail access revoked. Please reconnect." };
      }
      return { error: `Gmail API error: ${errText}` };
    }

    return { success: true, message: "Email sent via Gmail" };
  } catch (err) {
    return {
      error: `Failed to send via Gmail: ${err instanceof Error ? err.message : "Unknown error"}`,
    };
  }
}
