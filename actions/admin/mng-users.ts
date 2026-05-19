"use server";

import { connectToDatabase } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-in-production"
);

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("adminJwt")?.value;
  if (!token) throw new Error("Unauthorized");

  const { payload } = await jwtVerify(token, secret);
  if (payload.role !== "admin") throw new Error("Forbidden");
}

interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function listUsers(params: ListUsersParams) {
  try {
    await verifyAdmin();
  } catch {
    return { error: "Unauthorized" };
  }

  const { page = 1, limit = 10, search } = params;
  const skip = (page - 1) * limit;

  try {
    const db = await connectToDatabase();
    const query: Record<string, unknown> = {};

    if (search) {
      const regex = { $regex: search, $options: "i" };
      query.$or = [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { jobDomain: regex },
      ];
    }

    const [users, total] = await Promise.all([
      db
        .collection("users")
        .find(query)
        .project({ password: 0 })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("users").countDocuments(query),
    ]);

    return {
      users: users.map((u) => ({ ...u, _id: u._id.toString() })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch {
    return { error: "Failed to fetch users" };
  }
}

export async function deleteUser(userId: string) {
  try {
    await verifyAdmin();
  } catch {
    return { error: "Unauthorized" };
  }

  try {
    const db = await connectToDatabase();
    const result = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 0) {
      return { error: "User not found" };
    }

    return { success: true };
  } catch {
    return { error: "Failed to delete user" };
  }
}

export async function editUser(
  userId: string,
  data: Record<string, unknown>
) {
  try {
    await verifyAdmin();
  } catch {
    return { error: "Unauthorized" };
  }

  delete data._id;
  delete data.password;
  data.updatedAt = new Date();

  try {
    const db = await connectToDatabase();
    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, { $set: data });

    if (result.matchedCount === 0) {
      return { error: "User not found" };
    }

    return { success: true };
  } catch {
    return { error: "Failed to update user" };
  }
}

export async function getUser(userId: string) {
  try {
    await verifyAdmin();
  } catch {
    return { error: "Unauthorized" };
  }

  try {
    const db = await connectToDatabase();
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } });

    if (!user) return { error: "User not found" };

    return { user: { ...user, _id: user._id.toString() } };
  } catch {
    return { error: "Failed to fetch user" };
  }
}
