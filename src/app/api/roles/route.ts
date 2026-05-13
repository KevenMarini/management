import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const roles = await sql`
      SELECT * FROM roles ORDER BY created_at ASC
    `;
    return NextResponse.json(roles);
  } catch (error: any) {
    console.error("Fetch roles error:", error);
    // If table doesn't exist yet, return empty array instead of 500
    if (error.message && error.message.includes("relation \"roles\" does not exist")) {
        return NextResponse.json([]);
    }
    return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, title, tag, description, requirements } = body;

    if (!slug || !title || !tag || !description || !requirements) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await sql`
      INSERT INTO roles (slug, title, tag, description, requirements)
      VALUES (${slug}, ${title}, ${tag}, ${description}, ${requirements})
    `;

    return NextResponse.json({ message: "Role created successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("Create role error:", error);
    // Handle unique constraint violation for slug
    if (error.code === '23505') {
        return NextResponse.json({ error: "A role with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing role ID" }, { status: 400 });
    }

    await sql`
      DELETE FROM roles WHERE id = ${id}
    `;

    return NextResponse.json({ message: "Role deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Delete role error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
