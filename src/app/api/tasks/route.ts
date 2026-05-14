import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    // Fetch tasks
    let tasks;
    if (domain) {
      tasks = await sql`SELECT * FROM domain_tasks WHERE domain = ${domain} ORDER BY created_at DESC`;
    } else {
      tasks = await sql`SELECT * FROM domain_tasks ORDER BY created_at DESC`;
    }

    // Fetch questions for these tasks
    if (tasks.length > 0) {
      const taskIds = tasks.map(t => t.id);
      // Wait, Vercel Postgres doesn't easily support WHERE IN with an array of numbers like that without query building.
      // We can fetch all questions for these tasks by joining or doing a subquery, or fetching all questions and grouping.
      const questions = await sql`SELECT * FROM task_questions ORDER BY id ASC`;
      
      const tasksWithQuestions = tasks.map(task => ({
        ...task,
        questions: questions.filter(q => q.task_id === task.id)
      }));
      
      return NextResponse.json(tasksWithQuestions);
    }

    return NextResponse.json([]);
  } catch (error: any) {
    console.error("Fetch tasks error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { domain, technical_type, name, description, instructions, questions } = body;

    if (!domain || !name) {
      return NextResponse.json({ error: "Domain and name are required" }, { status: 400 });
    }

    // Insert task
    const taskResult = await sql`
      INSERT INTO domain_tasks (domain, technical_type, name, description, instructions)
      VALUES (${domain}, ${technical_type || null}, ${name}, ${description || ''}, ${instructions || ''})
      RETURNING id
    `;
    
    const taskId = taskResult[0].id;

    // Insert questions
    if (questions && questions.length > 0) {
      for (const q of questions) {
        await sql`
          INSERT INTO task_questions (task_id, question_text, answer_type)
          VALUES (${taskId}, ${q.text}, ${q.type})
        `;
      }
    }

    return NextResponse.json({ success: true, taskId });
  } catch (error: any) {
    console.error("Create task error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    await sql`DELETE FROM domain_tasks WHERE id = ${id}`;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete task error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
