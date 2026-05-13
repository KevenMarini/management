import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userid, password, email, phone } = await request.json();

    if (!userid || !password || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check for existing userid
    const existingUserid = await sql`
      SELECT id FROM users WHERE userid = ${userid} LIMIT 1
    `;
    if (existingUserid.length > 0) {
      return NextResponse.json({ error: "Username already taken. Please pick another one." }, { status: 400 });
    }

    // Check for existing email/phone
    const existingContact = await sql`
      SELECT id FROM users WHERE email = ${email} OR phone = ${phone} LIMIT 1
    `;
    if (existingContact.length > 0) {
      return NextResponse.json({ error: "An account with this email or phone already exists." }, { status: 400 });
    }

    await sql`
      INSERT INTO users (userid, password, email, phone)
      VALUES (${userid}, ${password}, ${email}, ${phone})
    `;

    return NextResponse.json({ message: "Account created successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
