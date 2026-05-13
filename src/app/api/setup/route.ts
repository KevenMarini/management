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

      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        tag TEXT NOT NULL,
        description TEXT NOT NULL,
        requirements TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      INSERT INTO roles (slug, title, tag, description, requirements)
      VALUES 
        ('frontend', 'Web Frontend Development', 'Development', 'Architect responsive, highly-interactive user interfaces for Plenum using React and Next.js. You will translate design mockups into seamless experiences.', 'Proficiency in HTML5, CSS3, and JavaScript (ES6+)\nExperience with React, Next.js, or modern JS frameworks\nUnderstanding of responsive design and web performance optimization'),
        ('backend', 'Web Backend Development', 'Development', 'Build the robust server-side architecture and APIs that power Plenum. You will handle database design, authentication, and core application logic.', 'Experience with Node.js, Python, or Go\nUnderstanding of RESTful APIs and database management (SQL/NoSQL)\nKnowledge of server deployment and basic security practices'),
        ('design', 'UI/UX Design', 'Creative', 'Shape the visual identity and user journey of Plenum. You will create intuitive wireframes, stunning high-fidelity prototypes, and design systems.', 'Proficiency in Figma, Adobe XD, or similar design tools\nStrong portfolio demonstrating user-centric design thinking\nAbility to create clean, modern, and accessible interfaces'),
        ('management', 'Project Management', 'Leadership', 'Coordinate teams, track milestones, and ensure the timely delivery of Plenum features. You are the glue that holds the technical and creative teams together.', 'Strong organizational and leadership skills\nExcellent communication and problem-solving abilities\nFamiliarity with Agile methodologies and project management tools')
      ON CONFLICT (slug) DO NOTHING;
    `;
    return NextResponse.json({ message: "Table created successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
