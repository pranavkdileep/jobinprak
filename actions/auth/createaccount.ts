"use server";

import { connectToDatabase } from "@/lib/db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function createAccount(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const jobDomain = formData.get("jobDomain") as string;

  const errors: Record<string, string> = {};

  if (!firstName?.trim()) errors.firstName = "First name is required";
  if (!lastName?.trim()) errors.lastName = "Last name is required";
  if (!email?.trim()) errors.email = "Email is required";
  if (!password || password.length < 6)
    errors.password = "Password must be at least 6 characters";
  if (!jobDomain?.trim()) errors.jobDomain = "Job domain is required";

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const db = await connectToDatabase();
    const existing = await db
      .collection("users")
      .findOne({ email: email.toLowerCase() });

    if (existing) {
      return { errors: { email: "Email already in use" } };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection("users").insertOne({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      jobDomain: jobDomain.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch {
    return { errors: { _form: "Something went wrong. Please try again." } };
  }

  redirect("/login");
}

export async function createAccountState(
  _previousState: { errors?: Record<string, string> },
  formData: FormData
) {
  return createAccount(formData);
}
