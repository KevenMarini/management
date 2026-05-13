import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS applicants (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        year TEXT NOT NULL,
        college TEXT,
        interest TEXT NOT NULL,
        experience TEXT NOT NULL,
        linkedin TEXT,
        skills TEXT NOT NULL,
        questions TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE applicants ADD COLUMN IF NOT EXISTS github_link TEXT;
      ALTER TABLE applicants ADD COLUMN IF NOT EXISTS website_link TEXT;
      ALTER TABLE applicants ADD COLUMN IF NOT EXISTS portfolio_link TEXT;

      CREATE TABLE IF NOT EXISTS admin_logs (
        id SERIAL PRIMARY KEY,
        admin_username TEXT NOT NULL,
        action TEXT NOT NULL,
        details TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    return NextResponse.json({ message: "Table created successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
