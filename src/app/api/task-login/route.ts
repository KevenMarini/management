import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userid, password } = await request.json();

    if (!userid || !password) {
      return NextResponse.json({ error: "User ID and password are required" }, { status: 400 });
    }

    const users = await sql`
      SELECT * FROM users WHERE userid = ${userid} AND password = ${password} LIMIT 1
    `;

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid User ID or Password" }, { status: 401 });
    }

    const user = users[0];

    const applicants = await sql`
      SELECT name, email, phone, domain FROM applicants 
      WHERE email = ${user.email} OR phone = ${user.phone}
      LIMIT 1
    `;

    const profileName = applicants.length > 0 ? applicants[0].name : "Unknown";
    
    // Extract first name for the requirement: "display the first name enetered"
    const firstName = profileName.split(" ")[0];

    return NextResponse.json({ 
      name: profileName,
      firstName: firstName,
      email: applicants.length > 0 ? applicants[0].email : user.email,
      phone: applicants.length > 0 ? applicants[0].phone : user.phone,
      domain: applicants.length > 0 ? applicants[0].domain : "Unknown"
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
