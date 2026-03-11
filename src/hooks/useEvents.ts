'use client'

import { useState, useEffect, useCallback } from 'react'
import { GanttEvent, Department } from '@/lib/types'

function normalizeDate(ev: GanttEvent): GanttEvent {
  return { ...ev, date: ev.date.slice(0, 10) }
}

export function useEvents(year: number, month: number) {
  const [events, setEvents] = useState<GanttEvent[]>([])
  const [loading, setLoading] = useState(true)

  const loadEvents = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/events?year=${year}&month=${month}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setEvents(data.map(normalizeDate))
      }
    } catch (err) {
      console.error('Failed to load events:', err)
    } finally {
      setLoading(false)
    }
  }, [year, month])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  const addEvent = async (payload: {
    title: string
    date: string
    department: Department
    details: string
  }) => {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      const newEvent = normalizeDate(await res.json())
      setEvents((prev) =>
        [...prev, newEvent].sort((a, b) => a.date.localeCompare(b.date))
      )
      return newEvent
    }
  }

  const updateEvent = async (
    id: number,
    payload: { title: string; date: string; department: Department; details: string }
  ) => {
    const res = await fetch(`/api/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      const updated = normalizeDate(await res.json())
      setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)))
      return updated
    }
  }

  const deleteEvent = async (id: number) => {
    const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setEvents((prev) => prev.filter((e) => e.id !== id))
    }
  }

  return { events, loading, addEvent, updateEvent, deleteEvent, refresh: loadEvents }
}
