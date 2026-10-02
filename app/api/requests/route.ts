import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  const { studyId, requestedBy, purpose } = await req.json();

  const [result]: any = await pool.query(
    `INSERT INTO requests (study_id, requested_by, purpose) VALUES (?, ?, ?)`,
    [studyId, requestedBy, purpose]
  );
  const requestId = result.insertId;

  const [[study]]: any = await pool.query(`SELECT title FROM studies WHERE id = ?`, [studyId]);

  await pool.query(
    `INSERT INTO notifications (recipient_role, type, message, related_request_id, related_study_id)
     VALUES ('admin', 'new_request', ?, ?, ?)`,
    [`New request for "${study.title}"`, requestId, studyId]
  );

  return NextResponse.json({ id: requestId }, { status: 201 });
}