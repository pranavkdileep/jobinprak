import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing-token", request.url));
  }

  try {
    const db = await connectToDatabase();
    const user = await db.collection("users").findOne({
      emailVerificationToken: token,
    });

    if (!user) {
      return NextResponse.redirect(new URL("/login?error=invalid-token", request.url));
    }

    if (user.isVerified) {
      return NextResponse.redirect(new URL("/login?error=already-verified", request.url));
    }

    if (user.emailVerificationExpires && new Date() > user.emailVerificationExpires) {
      return NextResponse.redirect(new URL("/login?error=token-expired", request.url));
    }

    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          isVerified: true,
          updatedAt: new Date(),
        },
        $unset: {
          emailVerificationToken: "",
          emailVerificationExpires: "",
        },
      }
    );

    return NextResponse.redirect(new URL("/login?verified=true", request.url));
  } catch {
    return NextResponse.redirect(new URL("/login?error=verification-failed", request.url));
  }
}
