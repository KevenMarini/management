import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    // Strictly restrict log viewing to Keven1
    if (username !== "Keven1") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const rows = await sql`
      SELECT * FROM admin_logs ORDER BY created_at DESC LIMIT 100
    `;
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { username, action, details } = await request.json();

    if (!username || !action) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await sql`
      INSERT INTO admin_logs (admin_username, action, details)
      VALUES (${username}, ${action}, ${details || null})
    `;

    return NextResponse.json({ message: "Log created" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
