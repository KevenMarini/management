import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const announcements = await sql`
      SELECT * FROM announcements ORDER BY created_at DESC
    `;
    return NextResponse.json(announcements);
  } catch (error: any) {
    console.error("Fetch announcements error:", error);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, link_text, link_url, author } = body;

    if (!title || !content || !author) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await sql`
      INSERT INTO announcements (title, content, link_text, link_url, author)
      VALUES (${title}, ${content}, ${link_text || null}, ${link_url || null}, ${author})
    `;

    return NextResponse.json({ message: "Announcement created successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("Create announcement error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing announcement ID" }, { status: 400 });
    }

    await sql`
      DELETE FROM announcements WHERE id = ${id}
    `;

    return NextResponse.json({ message: "Announcement deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Delete announcement error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
