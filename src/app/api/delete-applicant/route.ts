import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Applicant ID is required" }, { status: 400 });
    }

    await sql`
      DELETE FROM applicants WHERE id = ${id}
    `;

    return NextResponse.json({ success: true, message: "Application deleted successfully" });
  } catch (error: any) {
    console.error("Delete applicant error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
