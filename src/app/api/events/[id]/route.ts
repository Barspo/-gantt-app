import { getDb } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sql = getDb()
  const { id } = await params
  const body = await request.json()
  const { title, date, department, details } = body

  const result = await sql.query(
    `UPDATE events SET title = COALESCE($1, title), date = COALESCE($2, date), department = COALESCE($3, department), details = $4 WHERE id = $5 RETURNING id, title, date::text as date, department, details, created_at, updated_at`,
    [title, date, department, details ?? null, id]
  )

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  return NextResponse.json(result.rows[0])
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sql = getDb()
  const { id } = await params

  await sql.query(`DELETE FROM events WHERE id = $1`, [id])

  return NextResponse.json({ success: true })
}
