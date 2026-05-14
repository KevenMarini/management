import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Left join to get all applicants, and if they have a user profile, get those details too.
    const applicants = await sql`
      SELECT 
        a.id,
        FIRST_VALUE(a.name) OVER (PARTITION BY a.email ORDER BY a.created_at ASC) as name, 
        a.email, 
        a.phone, 
        a.college, 
        a.domain, 
        a.created_at as applied_at,
        u.userid,
        u.photo_link,
        u.age,
        u.dob,
        u.resume_link,
        u.linkedin,
        u.github,
        u.address
      FROM applicants a
      LEFT JOIN users u ON a.email = u.email OR a.phone = u.phone
      ORDER BY a.created_at DESC
    `;

    return NextResponse.json(applicants);
  } catch (error: any) {
    console.error("Fetch all applicants error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
