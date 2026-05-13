import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const roles = await sql`
      SELECT * FROM roles ORDER BY created_at ASC
    `;
    return NextResponse.json(roles);
  } catch (error: any) {
    console.error("Fetch roles error:", error);
    if (error.message && error.message.includes("relation \"roles\" does not exist")) {
        try {
          await sql`
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
          
          const newRoles = await sql`
            SELECT * FROM roles ORDER BY created_at ASC
          `;
          return NextResponse.json(newRoles);
        } catch (setupError) {
          console.error("Auto-setup failed:", setupError);
          return NextResponse.json([]);
        }
    }
    return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, title, tag, description, requirements } = body;

    if (!slug || !title || !tag || !description || !requirements) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
      await sql`
        INSERT INTO roles (slug, title, tag, description, requirements)
        VALUES (${slug}, ${title}, ${tag}, ${description}, ${requirements})
      `;
    } catch (insertError: any) {
      if (insertError.message && insertError.message.includes("relation \"roles\" does not exist")) {
        await sql`
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
        `;
        await sql`
          INSERT INTO roles (slug, title, tag, description, requirements)
          VALUES (${slug}, ${title}, ${tag}, ${description}, ${requirements})
        `;
      } else {
        throw insertError;
      }
    }

    return NextResponse.json({ message: "Role created successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("Create role error:", error);
    // Handle unique constraint violation for slug
    if (error.code === '23505') {
        return NextResponse.json({ error: "A role with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing role ID" }, { status: 400 });
    }

    await sql`
      DELETE FROM roles WHERE id = ${id}
    `;

    return NextResponse.json({ message: "Role deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Delete role error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
