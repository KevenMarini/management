import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const applicants = await sql`
      SELECT domain FROM applicants 
      WHERE LOWER(name) = LOWER(${name}) AND LOWER(email) = LOWER(${email})
      LIMIT 1
    `;

    if (applicants.length === 0) {
      return NextResponse.json({ error: "Applicant not found. Please check your name and email." }, { status: 404 });
    }

    return NextResponse.json({ domain: applicants[0].domain });
  } catch (error: any) {
    console.error("Fetch domain error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
