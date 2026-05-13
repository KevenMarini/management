import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    // Authorize all registered admins to delete
    const authorizedAdmins = ["Keven1", "Smitha2", "Deekshit3", "Ananya4"];
    if (!username || !authorizedAdmins.includes(username)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await sql`
      DELETE FROM applicants WHERE id = ${id}
    `;

    return NextResponse.json({ message: "Applicant deleted successfully" });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
