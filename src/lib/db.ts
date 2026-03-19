import { Pool } from '@neondatabase/serverless'

let pool: Pool | null = null
let migrated = false

export function getDb() {
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL! })
  }
  return pool
}

export async function runMigrations() {
  if (migrated) return
  const db = getDb()
  await db.query(`UPDATE events SET department = 'campaigns' WHERE department = 'tech_data'`)
  migrated = true
}
