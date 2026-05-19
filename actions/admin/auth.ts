"use server";

import { connectToDatabase } from "@/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-in-production"
);

export async function adminLogin(
  _prevState: { errors?: Record<string, string> },
  formData: FormData
) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const errors: Record<string, string> = {};

  if (!username?.trim()) errors.username = "Username is required";
  if (!password) errors.password = "Password is required";

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const db = await connectToDatabase();
    const admin = await db
      .collection("admin")
      .findOne({ username: username.trim() });

    if (!admin) {
      return { errors: { _form: "Invalid credentials" } };
    }

    const isValid = password === admin.password;
    if (!isValid) {
      return { errors: { _form: "Invalid credentials" } };
    }

    const token = await new SignJWT({
      adminId: admin._id.toString(),
      username: admin.username,
      role: "admin",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const cookieStore = await cookies();
    cookieStore.set("adminJwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  } catch {
    return { errors: { _form: "Something went wrong. Please try again." } };
  }

  redirect("/admin/dash");
}
