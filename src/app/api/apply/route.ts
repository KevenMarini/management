import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      year,
      college,
      interest,
      experience,
      linkedin,
      portfolio,
      github,
      skills,
      questions,
      domain,
    } = body;

    // Map any profile link to the linkedin column
    const profileLink = linkedin || portfolio || github || null;

    if (!name || !email || !phone || !year) {
      return NextResponse.json({ error: "Missing required core fields" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email} OR phone = ${phone} LIMIT 1
    `;

    // Ensure undefined fields are mapped correctly for database
    // Note: interest, experience, and skills are NOT NULL in the schema, so we use empty string as fallback.
    const collegeVal = college || null;
    const interestVal = interest || "";
    const experienceVal = experience || "";
    const skillsVal = skills || "";
    const questionsVal = questions || null;

    await sql`
      INSERT INTO applicants (name, email, phone, year, college, interest, experience, linkedin, skills, questions, domain)
      VALUES (${name}, ${email}, ${phone}, ${year}, ${collegeVal}, ${interestVal}, ${experienceVal}, ${profileLink}, ${skillsVal}, ${questionsVal}, ${domain || 'Management'})
    `;

    return NextResponse.json({ 
      message: "Application submitted successfully", 
      needsAccount: existingUser.length === 0,
      email,
      phone
    }, { status: 201 });
  } catch (error: any) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
