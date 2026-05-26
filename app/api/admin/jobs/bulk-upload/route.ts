import { NextResponse } from "next/server";
import { bulkUploadFromRestApi } from "@/actions/admin/jobs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { auth, data } = body;

    if (!auth?.username || !auth?.password || !Array.isArray(data)) {
      return NextResponse.json(
        { error: "Invalid request body. Expected { auth: { username, password }, data: [...] }" },
        { status: 400 }
      );
    }

    const result = await bulkUploadFromRestApi(auth, data);

    if ("error" in result) {
      const status = result.error === "Invalid credentials" ? 401 : 400;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }
}
