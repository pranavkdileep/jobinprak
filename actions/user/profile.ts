"use server";

import { connectToDatabase } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import type { User } from "@/types/user";
import bcrypt from "bcryptjs";

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

export interface EditProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    pin?: string;
    state?: string;
    country?: string;
  };
  jobDomain?: string;
  skills?: string[];
  summary?: string;
  education?: Array<{
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  experience?: Array<{
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string[];
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
  languages?: string[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    twitter?: string;
  };
}

export async function getUserProfile() {
  try {
    const session = await getUserFromSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    const db = await connectToDatabase();
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(session.userId as string) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return { error: "User not found" };
    }

    return {
      user: {
        ...user,
        _id: user._id.toString(),
        createdAt: user.createdAt?.toISOString?.() ?? user.createdAt,
        updatedAt: user.updatedAt?.toISOString?.() ?? user.updatedAt,
      },
    };
  } catch {
    return { error: "Failed to fetch profile" };
  }
}

export async function editUserProfile(data: EditProfileData) {
  try {
    const session = await getUserFromSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    const db = await connectToDatabase();
    const userId = new ObjectId(session.userId as string);

    const updateData: Partial<User> & { updatedAt: Date } = {
      updatedAt: new Date(),
    };

    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.address !== undefined) updateData.address = data.address as User["address"];
    if (data.jobDomain !== undefined) updateData.jobDomain = data.jobDomain;
    if (data.skills !== undefined) updateData.skills = data.skills;
    if (data.summary !== undefined) updateData.summary = data.summary;
    if (data.education !== undefined) updateData.education = data.education as User["education"];
    if (data.experience !== undefined) updateData.experience = data.experience as User["experience"];
    if (data.projects !== undefined) updateData.projects = data.projects as User["projects"];
    if (data.certifications !== undefined) updateData.certifications = data.certifications as User["certifications"];
    if (data.languages !== undefined) updateData.languages = data.languages;
    if (data.socialLinks !== undefined) updateData.socialLinks = data.socialLinks as User["socialLinks"];

    const result = await db.collection("users").updateOne(
      { _id: userId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return { error: "User not found" };
    }

    return { success: true, message: "Profile updated successfully" };
  } catch {
    return { error: "Failed to update profile" };
  }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const errors: Record<string, string> = {};

  if (!currentPassword) errors.currentPassword = "Current password is required";
  if (!newPassword) errors.newPassword = "New password is required";
  if (newPassword && newPassword.length < 6) errors.newPassword = "Password must be at least 6 characters";

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const session = await getUserFromSession();
    if (!session) {
      return { errors: { _form: "Unauthorized" } };
    }

    const db = await connectToDatabase();
    const userId = new ObjectId(session.userId as string);

    const user = await db.collection("users").findOne({ _id: userId });
    if (!user) {
      return { errors: { _form: "User not found" } };
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return { errors: { currentPassword: "Current password is incorrect" } };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.collection("users").updateOne(
      { _id: userId },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );

    return { success: true, message: "Password changed successfully" };
  } catch {
    return { errors: { _form: "Failed to change password" } };
  }
}

export async function addEducation(data: User["education"][0]) {
  try {
    const session = await getUserFromSession();
    if (!session) return { error: "Unauthorized" };

    const db = await connectToDatabase();
    const userId = new ObjectId(session.userId as string);

    const result = await db.collection("users").updateOne(
      { _id: userId },
      { $push: { education: data as never }, $set: { updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) return { error: "User not found" };
    return { success: true, message: "Education added successfully" };
  } catch {
    return { error: "Failed to add education" };
  }
}

export async function editEducation(index: number, data: User["education"][0]) {
  try {
    const session = await getUserFromSession();
    if (!session) return { error: "Unauthorized" };

    const db = await connectToDatabase();
    const userId = new ObjectId(session.userId as string);

    const result = await db.collection("users").updateOne(
      { _id: userId },
      { $set: { [`education.${index}`]: data, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) return { error: "User not found" };
    if (result.modifiedCount === 0) return { error: "Education not found" };
    return { success: true, message: "Education updated successfully" };
  } catch {
    return { error: "Failed to update education" };
  }
}

export async function deleteEducation(index: number) {
  try {
    const session = await getUserFromSession();
    if (!session) return { error: "Unauthorized" };

    const db = await connectToDatabase();
    const userId = new ObjectId(session.userId as string);

    const user = await db.collection("users").findOne({ _id: userId });
    if (!user) return { error: "User not found" };

    const education = user.education || [];
    education.splice(index, 1);

    const result = await db.collection("users").updateOne(
      { _id: userId },
      { $set: { education, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) return { error: "User not found" };
    return { success: true, message: "Education deleted successfully" };
  } catch {
    return { error: "Failed to delete education" };
  }
}

export async function addExperience(data: User["experience"][0]) {
  try {
    const session = await getUserFromSession();
    if (!session) return { error: "Unauthorized" };

    const db = await connectToDatabase();
    const userId = new ObjectId(session.userId as string);

    const result = await db.collection("users").updateOne(
      { _id: userId },
      { $push: { experience: data as never }, $set: { updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) return { error: "User not found" };
    return { success: true, message: "Experience added successfully" };
  } catch {
    return { error: "Failed to add experience" };
  }
}

export async function editExperience(index: number, data: User["experience"][0]) {
  try {
    const session = await getUserFromSession();
    if (!session) return { error: "Unauthorized" };

    const db = await connectToDatabase();
    const userId = new ObjectId(session.userId as string);

    const result = await db.collection("users").updateOne(
      { _id: userId },
      { $set: { [`experience.${index}`]: data, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) return { error: "User not found" };
    if (result.modifiedCount === 0) return { error: "Experience not found" };
    return { success: true, message: "Experience updated successfully" };
  } catch {
    return { error: "Failed to update experience" };
  }
}

export async function deleteExperience(index: number) {
  try {
    const session = await getUserFromSession();
    if (!session) return { error: "Unauthorized" };

    const db = await connectToDatabase();
    const userId = new ObjectId(session.userId as string);

    const user = await db.collection("users").findOne({ _id: userId });
    if (!user) return { error: "User not found" };

    const experience = user.experience || [];
    experience.splice(index, 1);

    const result = await db.collection("users").updateOne(
      { _id: userId },
      { $set: { experience, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) return { error: "User not found" };
    return { success: true, message: "Experience deleted successfully" };
  } catch {
    return { error: "Failed to delete experience" };
  }
}

export async function addProject(data: User["projects"][0]) {
  try {
    const session = await getUserFromSession();
    if (!session) return { error: "Unauthorized" };

    const db = await connectToDatabase();
    const userId = new ObjectId(session.userId as string);

    const result = await db.collection("users").updateOne(
      { _id: userId },
      { $push: { projects: data as never }, $set: { updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) return { error: "User not found" };
    return { success: true, message: "Project added successfully" };
  } catch {
    return { error: "Failed to add project" };
  }
}

export async function editProject(index: number, data: User["projects"][0]) {
  try {
    const session = await getUserFromSession();
    if (!session) return { error: "Unauthorized" };

    const db = await connectToDatabase();
    const userId = new ObjectId(session.userId as string);

    const result = await db.collection("users").updateOne(
      { _id: userId },
      { $set: { [`projects.${index}`]: data, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) return { error: "User not found" };
    if (result.modifiedCount === 0) return { error: "Project not found" };
    return { success: true, message: "Project updated successfully" };
  } catch {
    return { error: "Failed to update project" };
  }
}

export async function deleteProject(index: number) {
  try {
    const session = await getUserFromSession();
    if (!session) return { error: "Unauthorized" };

    const db = await connectToDatabase();
    const userId = new ObjectId(session.userId as string);

    const user = await db.collection("users").findOne({ _id: userId });
    if (!user) return { error: "User not found" };

    const projects = user.projects || [];
    projects.splice(index, 1);

    const result = await db.collection("users").updateOne(
      { _id: userId },
      { $set: { projects, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) return { error: "User not found" };
    return { success: true, message: "Project deleted successfully" };
  } catch {
    return { error: "Failed to delete project" };
  }
}

export async function addCertification(data: User["certifications"][0]) {
  try {
    const session = await getUserFromSession();
    if (!session) return { error: "Unauthorized" };

    const db = await connectToDatabase();
    const userId = new ObjectId(session.userId as string);

    const result = await db.collection("users").updateOne(
      { _id: userId },
      { $push: { certifications: data as never }, $set: { updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) return { error: "User not found" };
    return { success: true, message: "Certification added successfully" };
  } catch {
    return { error: "Failed to add certification" };
  }
}

export async function editCertification(index: number, data: User["certifications"][0]) {
  try {
    const session = await getUserFromSession();
    if (!session) return { error: "Unauthorized" };

    const db = await connectToDatabase();
    const userId = new ObjectId(session.userId as string);

    const result = await db.collection("users").updateOne(
      { _id: userId },
      { $set: { [`certifications.${index}`]: data, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) return { error: "User not found" };
    if (result.modifiedCount === 0) return { error: "Certification not found" };
    return { success: true, message: "Certification updated successfully" };
  } catch {
    return { error: "Failed to update certification" };
  }
}

export async function deleteCertification(index: number) {
  try {
    const session = await getUserFromSession();
    if (!session) return { error: "Unauthorized" };

    const db = await connectToDatabase();
    const userId = new ObjectId(session.userId as string);

    const user = await db.collection("users").findOne({ _id: userId });
    if (!user) return { error: "User not found" };

    const certifications = user.certifications || [];
    certifications.splice(index, 1);

    const result = await db.collection("users").updateOne(
      { _id: userId },
      { $set: { certifications, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) return { error: "User not found" };
    return { success: true, message: "Certification deleted successfully" };
  } catch {
    return { error: "Failed to delete certification" };
  }
}
