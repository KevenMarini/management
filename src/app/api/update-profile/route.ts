import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userid, password, photoLink, age, dob, resumeLink, linkedin, github, address } = await request.json();

    if (!userid || !password) {
      return NextResponse.json({ error: "User ID and password are required" }, { status: 400 });
    }

    const users = await sql`
      SELECT * FROM users WHERE userid = ${userid} AND password = ${password} LIMIT 1
    `;

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid User ID or Password" }, { status: 401 });
    }

    await sql`
      UPDATE users 
      SET 
        photo_link = ${photoLink},
        age = ${age},
        dob = ${dob},
        resume_link = ${resumeLink},
        linkedin = ${linkedin},
        github = ${github},
        address = ${address}
      WHERE userid = ${userid}
    `;

    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
