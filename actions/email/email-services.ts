"use server";

export interface EmailResult {
  success: boolean;
  message: string;
}

export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<EmailResult> {
  console.log("=".repeat(60));
  console.log("MOCK EMAIL SERVICE");
  console.log("=".repeat(60));
  console.log(`To: ${email}`);
  console.log(`Subject: Verify your email address`);
  console.log(`Body:`);
  console.log(`  Thank you for registering!`);
  console.log(`  Please verify your email by clicking the link below:`);
  console.log(`  ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify-email?token=${token}`);
  console.log("=".repeat(60));

  return {
    success: true,
    message: `Verification email sent to ${email}`,
  };
}

export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<EmailResult> {
  console.log("=".repeat(60));
  console.log("MOCK EMAIL SERVICE");
  console.log("=".repeat(60));
  console.log(`To: ${email}`);
  console.log(`Subject: Reset your password`);
  console.log(`Body:`);
  console.log(`  You requested a password reset.`);
  console.log(`  Click the link below to reset your password:`);
  console.log(`  ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`);
  console.log(`  This link will expire in 1 hour.`);
  console.log("=".repeat(60));

  return {
    success: true,
    message: `Password reset email sent to ${email}`,
  };
}
