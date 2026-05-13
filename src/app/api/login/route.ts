import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

const ADMINS = [
  { username: "Keven1", password: "planum2552*" },
  { username: "Smitha2", password: "planum3553*" },
  { username: "Deekshit3", password: "planum4554*" },
  { username: "Ananya4", password: "planum5555*" },
];

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const found = ADMINS.find((a) => a.username === username && a.password === password);

    if (found) {
      // Log successful login (non-blocking — don't let a log failure break login)
      try {
        await sql`
          INSERT INTO admin_logs (admin_username, action, details)
          VALUES (${found.username}, 'Login', 'Successful login')
        `;
      } catch (logErr) {
        console.warn("Audit log failed (login success):", logErr);
      }
      return NextResponse.json({ success: true, username: found.username });
    } else {
      // Log failed login attempt (non-blocking)
      try {
        await sql`
          INSERT INTO admin_logs (admin_username, action, details)
          VALUES (${username}, 'Login Failed', 'Invalid credentials')
        `;
      } catch (logErr) {
        console.warn("Audit log failed (login failed):", logErr);
      }
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
