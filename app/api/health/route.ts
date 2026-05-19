import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function GET() {
  try {
    const db = await connectToDatabase();
    await db.command({ ping: 1 });
    return NextResponse.json({
      status: "ok",
      db: "connected",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        db: "disconnected",
        message: (error as Error).message,
      },
      { status: 503 }
    );
  }
}
