import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminUsername = searchParams.get("username");

    // Join with users table to get credentials
    const rows = await sql`
      SELECT 
        a.*, 
        u.userid, 
        u.password as user_password 
      FROM applicants a
      LEFT JOIN users u ON a.email = u.email
      ORDER BY a.created_at DESC
    `;

    // Filter sensitive info if not authorized admin
    const isAuthorized = adminUsername === "Keven1" || adminUsername === "Smitha2";
    const processedRows = rows.map(row => {
      if (!isAuthorized) {
        const { userid, user_password, ...rest } = row;
        return rest;
      }
      return row;
    });

    return NextResponse.json(processedRows);
  } catch (error: any) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
