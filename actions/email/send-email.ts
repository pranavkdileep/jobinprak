"use server";

import { EmailResult } from "./email-services";

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL || "onboarding@ktucyber.com";

  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — falling back to mock mode.");
    console.log("=".repeat(60));
    console.log("MOCK EMAIL SERVICE");
    console.log("=".repeat(60));
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log("=".repeat(60));
    return { success: true, message: `Mock email sent to ${to}` };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `JobInPark <${from}>`,
        to: [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { success: false, message: `Resend API error (${res.status}): ${err}` };
    }

    return { success: true, message: `Email sent to ${to}` };
  } catch (err) {
    return { success: false, message: `Failed to send email: ${err instanceof Error ? err.message : "Unknown error"}` };
  }
}