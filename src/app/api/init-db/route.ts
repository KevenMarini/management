import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Add domain column if missing
    await sql`
      ALTER TABLE applicants ADD COLUMN IF NOT EXISTS domain VARCHAR(50) DEFAULT 'Management'
    `;
    
    // 2. Ensure all required columns exist (adding others just in case)
    // Most should already be there from previous sessions
    
    // 3. Create announcements table
    await sql`
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        link_text VARCHAR(100),
        link_url VARCHAR(255),
        author VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 4. Create users table for credentials
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        userid VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) UNIQUE NOT NULL,
        photo_link VARCHAR(255),
        age VARCHAR(10),
        dob VARCHAR(50),
        resume_link VARCHAR(255),
        linkedin VARCHAR(255),
        github VARCHAR(255),
        address TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 4.5 Add new columns to users table if they don't exist
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS photo_link VARCHAR(255)`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS age VARCHAR(10)`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS dob VARCHAR(50)`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS resume_link VARCHAR(255)`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin VARCHAR(255)`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS github VARCHAR(255)`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT`;

    // 5. Create admin_logs table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_logs (
        id SERIAL PRIMARY KEY,
        admin_username VARCHAR(100) NOT NULL,
        action VARCHAR(100) NOT NULL,
        details TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // 6. Create domain_tasks table
    await sql`
      CREATE TABLE IF NOT EXISTS domain_tasks (
        id SERIAL PRIMARY KEY,
        domain VARCHAR(100) NOT NULL,
        technical_type VARCHAR(20),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        instructions TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 7. Create task_questions table
    await sql`
      CREATE TABLE IF NOT EXISTS task_questions (
        id SERIAL PRIMARY KEY,
        task_id INTEGER REFERENCES domain_tasks(id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        answer_type VARCHAR(20) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    return NextResponse.json({ 
      success: true, 
      message: "Database schema synchronized successfully. Task tables added." 
    });
  } catch (error: any) {
    console.error("Migration error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
