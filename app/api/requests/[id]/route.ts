import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { adminId } = await req.json();
  const requestId = params.id;

  await pool.query(
    `UPDATE requests SET status='approved', responded_at=NOW(), responded_by=? WHERE id=?`,
    [adminId, requestId]
  );

  const [[request]]: any = await pool.query(
    `SELECT r.requested_by, s.id AS study_id, s.title 
     FROM requests r JOIN studies s ON r.study_id = s.id WHERE r.id = ?`,
    [requestId]
  );

  await pool.query(
    `INSERT INTO notifications (recipient_id, recipient_role, type, message, related_request_id, related_study_id)
     VALUES (?, 'student', 'request_approved', ?, ?, ?)`,
    [request.requested_by, `Your request for "${request.title}" was approved.`, requestId, request.study_id]
  );

  return NextResponse.json({ success: true });
} 