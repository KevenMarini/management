import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userid, password, domain } = await request.json();

    if (!userid || !password || !domain) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify user
    const users = await sql`
      SELECT * FROM users WHERE userid = ${userid} AND password = ${password} LIMIT 1
    `;

    if (users.length === 0) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = users[0];

    // Get an existing applicant row
    const existing = await sql`
      SELECT * FROM applicants WHERE email = ${user.email} OR phone = ${user.phone} LIMIT 1
    `;

    if (existing.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const applicant = existing[0];

    // Check if already applied to this specific domain
    const alreadyApplied = await sql`
      SELECT id FROM applicants WHERE (email = ${user.email} OR phone = ${user.phone}) AND LOWER(domain) = LOWER(${domain})
    `;

    if (alreadyApplied.length > 0) {
      return NextResponse.json({ error: "Already applied to this domain" }, { status: 400 });
    }

    // Insert new application
    await sql`
      INSERT INTO applicants (name, email, phone, year, college, interest, experience, linkedin, skills, questions, domain)
      VALUES (
        ${applicant.name}, 
        ${applicant.email}, 
        ${applicant.phone}, 
        ${applicant.year}, 
        ${applicant.college}, 
        ${applicant.interest}, 
        ${applicant.experience}, 
        ${applicant.linkedin}, 
        ${applicant.skills}, 
        ${applicant.questions}, 
        ${domain}
      )
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Quick apply error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
