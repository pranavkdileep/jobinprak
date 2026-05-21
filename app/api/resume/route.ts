import { getUserProfile } from "@/actions/user/profile";
import { renderResume } from "@/lib/resume-templates";
import type { User } from "@/types/user";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const theme = searchParams.get("theme") || "minimalist";

  const result = await getUserProfile();
  if ("error" in result || !result.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = result.user as User;
  const html = renderResume(user, theme);
  const fileName = `${user.firstName}_${user.lastName}_resume.html`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
