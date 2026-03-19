import { getDb, runMigrations } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const sql = getDb()
  await runMigrations()
  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month')
  const year = searchParams.get('year')

  if (!month || !year) {
    return NextResponse.json({ error: 'month and year required' }, { status: 400 })
  }

  const startDate = `${year}-${month.padStart(2, '0')}-01`
  const lastDay = new Date(Number(year), Number(month), 0).getDate()
  const endDate = `${year}-${month.padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

  const result = await sql.query(
    `SELECT id, title, date::text as date, department, details, created_at, updated_at FROM events WHERE date >= $1 AND date <= $2 ORDER BY date ASC, department ASC`,
    [startDate, endDate]
  )

  return NextResponse.json(result.rows)
}

export async function POST(request: NextRequest) {
  const sql = getDb()
  const body = await request.json()
  const { title, date, department, details } = body

  if (!title || !date || !department) {
    return NextResponse.json({ error: 'title, date, and department are required' }, { status: 400 })
  }

  const result = await sql.query(
    `INSERT INTO events (title, date, department, details) VALUES ($1, $2, $3, $4) RETURNING id, title, date::text as date, department, details, created_at, updated_at`,
    [title, date, department, details || null]
  )

  return NextResponse.json(result.rows[0], { status: 201 })
}
