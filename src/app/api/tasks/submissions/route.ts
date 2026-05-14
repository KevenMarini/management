import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// POST to submit a task
export async function POST(request: Request) {
  try {
    const { userid, password, taskId, answers } = await request.json();

    if (!userid || !password || !taskId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify user
    const users = await sql`SELECT id FROM users WHERE userid = ${userid} AND password = ${password} LIMIT 1`;
    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Check if already submitted
    const existing = await sql`SELECT id FROM task_submissions WHERE task_id = ${taskId} AND userid = ${userid}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: "You have already submitted this task" }, { status: 400 });
    }

    // Insert submission
    const subResult = await sql`
      INSERT INTO task_submissions (task_id, userid) VALUES (${taskId}, ${userid}) RETURNING id
    `;
    const submissionId = subResult[0].id;

    // Insert answers
    if (answers && Object.keys(answers).length > 0) {
      for (const questionId of Object.keys(answers)) {
        await sql`
          INSERT INTO task_answers (submission_id, question_id, answer_text)
          VALUES (${submissionId}, ${questionId}, ${answers[questionId]})
        `;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Task submission error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// GET to fetch submissions for Admin
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    const userid = searchParams.get('userid');

    if (userid) {
      // Fetch all tasks completed by this user
      const completed = await sql`SELECT task_id FROM task_submissions WHERE userid = ${userid}`;
      return NextResponse.json(completed.map((c: any) => c.task_id));
    }

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required for fetching submissions" }, { status: 400 });
    }

    // Fetch all submissions for a specific task
    const submissions = await sql`
      SELECT s.id as submission_id, s.created_at, s.status, u.userid, 
             (SELECT a.name FROM applicants a WHERE a.email = u.email ORDER BY a.created_at ASC LIMIT 1) as user_name
      FROM task_submissions s
      JOIN users u ON s.userid = u.userid
      WHERE s.task_id = ${taskId}
      ORDER BY s.created_at DESC
    `;

    // Fetch all answers for these submissions
    let result = [];
    for (const sub of submissions) {
      const answers = await sql`
        SELECT a.answer_text, q.question_text
        FROM task_answers a
        JOIN task_questions q ON a.question_id = q.id
        WHERE a.submission_id = ${sub.submission_id}
      `;
      result.push({
        ...sub,
        answers
      });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Fetch submissions error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// PATCH to update the status of a specific submission
export async function PATCH(request: Request) {
  try {
    const { submissionId, status } = await request.json();

    if (!submissionId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await sql`UPDATE task_submissions SET status = ${status} WHERE id = ${submissionId}`;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update submission error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// DELETE to remove a specific submission
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const submissionId = searchParams.get('id');

    if (!submissionId) {
      return NextResponse.json({ error: "Submission ID is required" }, { status: 400 });
    }

    await sql`DELETE FROM task_submissions WHERE id = ${submissionId}`;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete submission error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
