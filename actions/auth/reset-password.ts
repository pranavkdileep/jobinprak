"use server";

import { connectToDatabase } from "@/lib/db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { start } from "workflow/api";
import { sendPasswordResetEmailWorkflow } from "@/workflows/user-auth";
import { ObjectId } from "mongodb";

export async function requestPasswordReset(
  formData: FormData
): Promise<{ errors?: Record<string, string>; success?: boolean; message?: string }> {
  const email = formData.get("email") as string;

  if (!email?.trim()) {
    return { errors: { email: "Email is required" } };
  }

  try {
    const db = await connectToDatabase();
    const user = await db
      .collection("users")
      .findOne({ email: email.toLowerCase().trim() }, { projection: { _id: 1 } });

    if (!user) {
      return { errors: { _form: "If an account with that email exists, a reset link has been sent." } };
    }

    await start(sendPasswordResetEmailWorkflow, [user._id.toString()]);

    return { success: true, message: "If an account with that email exists, a reset link has been sent." };
  } catch {
    return { errors: { _form: "Something went wrong. Please try again." } };
  }
}

export async function resetPassword(
  token: string,
  formData: FormData
): Promise<{ errors?: Record<string, string> }> {
  const password = formData.get("password") as string;

  if (!password || password.length < 6) {
    return { errors: { password: "Password must be at least 6 characters" } };
  }

  try {
    const db = await connectToDatabase();
    const user = await db.collection("users").findOne({
      passwordResetToken: token,
    });

    if (!user) {
      return { errors: { _form: "Invalid or expired reset token." } };
    }

    if (user.passwordResetExpires && new Date() > user.passwordResetExpires) {
      return { errors: { _form: "Reset token has expired." } };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection("users").updateOne(
      { _id: new ObjectId(user._id) },
      {
        $set: { password: hashedPassword, updatedAt: new Date() },
        $unset: { passwordResetToken: "", passwordResetExpires: "" },
      }
    );
  } catch {
    return { errors: { _form: "Something went wrong. Please try again." } };
  }

  redirect("/login?password-reset=true");
}

export async function requestPasswordResetState(
  _previousState: { errors?: Record<string, string>; success?: boolean; message?: string },
  formData: FormData
) {
  return requestPasswordReset(formData);
}

export async function resetPasswordState(
  token: string,
  _previousState: { errors?: Record<string, string> },
  formData: FormData
) {
  return resetPassword(token, formData);
}
