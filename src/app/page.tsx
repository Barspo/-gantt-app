'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import Header from '@/components/Header'
import Toolbar from '@/components/Toolbar'
import GanttGrid from '@/components/GanttGrid'
import EventModal from '@/components/EventModal'
import { useEvents } from '@/hooks/useEvents'
import { DEPARTMENT_ORDER } from '@/lib/constants'
import { GanttEvent, Department } from '@/lib/types'

export default function Home() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [activeDepartments, setActiveDepartments] = useState<Set<Department>>(
    new Set(DEPARTMENT_ORDER)
  )
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<GanttEvent | null>(null)
  const [defaultDate, setDefaultDate] = useState<string>('')
  const [defaultDepartment, setDefaultDepartment] = useState<Department>('lapid')

  const { events, loading, addEvent, updateEvent, deleteEvent } = useEvents(year, month)

  // Compute week info for the current month
  const weekInfos = useMemo(() => {
    const daysInMonth = new Date(year, month, 0).getDate()
    const today = new Date()
    const todayDay = (year === today.getFullYear() && month === today.getMonth() + 1) ? today.getDate() : -1

    const result: { weekIdx: number; label: string; containsToday: boolean }[] = []
    let weekIdx = 0
    let weekDays: number[] = []

    const firstDayOfWeek = new Date(year, month - 1, 1).getDay()
    for (let i = 0; i < firstDayOfWeek; i++) weekDays.push(0)

    for (let d = 1; d <= daysInMonth; d++) {
      weekDays.push(d)
      const dayOfWeek = new Date(year, month - 1, d).getDay()
      if (dayOfWeek === 6 || d === daysInMonth) {
        const validDays = weekDays.filter(x => x > 0)
        const start = validDays[0]
        const end = validDays[validDays.length - 1]
        result.push({
          weekIdx,
          label: start === end ? `${start}` : `${start}-${end}`,
          containsToday: todayDay >= start && todayDay <= end,
        })
        weekIdx++
        weekDays = []
      }
    }
    return result
  }, [year, month])

  const [activeWeeks, setActiveWeeks] = useState<Set<number>>(new Set())

  // Reset week filter when month changes
  useEffect(() => {
    const currentWeekIdx = weekInfos.findIndex(w => w.containsToday)
    if (currentWeekIdx >= 0) {
      setActiveWeeks(new Set(weekInfos.slice(currentWeekIdx).map(w => w.weekIdx)))
    } else {
      setActiveWeeks(new Set(weekInfos.map(w => w.weekIdx)))
    }
  }, [weekInfos])

  const toggleWeek = (weekIdx: number) => {
    setActiveWeeks(prev => {
      const next = new Set(prev)
      if (next.has(weekIdx)) {
        if (next.size > 1) next.delete(weekIdx)
      } else {
        next.add(weekIdx)
      }
      return next
    })
  }

  const goToPrevMonth = () => {
    if (month === 1) {
      setMonth(12)
      setYear((y) => y - 1)
    } else {
      setMonth((m) => m - 1)
    }
  }

  const goToNextMonth = () => {
    if (month === 12) {
      setMonth(1)
      setYear((y) => y + 1)
    } else {
      setMonth((m) => m + 1)
    }
  }

  const goToToday = () => {
    const today = new Date()
    setYear(today.getFullYear())
    setMonth(today.getMonth() + 1)
  }

  const toggleDepartment = (dept: Department) => {
    setActiveDepartments((prev) => {
      const next = new Set(prev)
      if (next.has(dept)) {
        if (next.size > 1) next.delete(dept)
      } else {
        next.add(dept)
      }
      return next
    })
  }

  const handleAddEvent = () => {
    setEditingEvent(null)
    const todayStr = `${year}-${String(month).padStart(2, '0')}-${String(Math.min(now.getDate(), new Date(year, month, 0).getDate())).padStart(2, '0')}`
    setDefaultDate(todayStr)
    setDefaultDepartment('lapid')
    setModalOpen(true)
  }

  const handleCellClick = useCallback((date: string, department: Department) => {
    setEditingEvent(null)
    setDefaultDate(date)
    setDefaultDepartment(department)
    setModalOpen(true)
  }, [])

  const handleEventClick = useCallback((event: GanttEvent) => {
    setEditingEvent(event)
    setModalOpen(true)
  }, [])

  const handleSave = async (data: {
    title: string
    date: string
    department: Department
    details: string
  }) => {
    if (editingEvent) {
      await updateEvent(editingEvent.id, data)
    } else {
      await addEvent(data)
    }
    setModalOpen(false)
    setEditingEvent(null)
  }

  const handleDelete = async (id: number) => {
    await deleteEvent(id)
    setModalOpen(false)
    setEditingEvent(null)
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <Toolbar
        year={year}
        month={month}
        onPrevMonth={goToPrevMonth}
        onNextMonth={goToNextMonth}
        onToday={goToToday}
        onAddEvent={handleAddEvent}
        activeDepartments={activeDepartments}
        onToggleDepartment={toggleDepartment}
        weekInfos={weekInfos}
        activeWeeks={activeWeeks}
        onToggleWeek={toggleWeek}
      />
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-400 text-lg">טוען אירועים...</div>
        </div>
      ) : (
        <GanttGrid
          year={year}
          month={month}
          events={events}
          activeDepartments={activeDepartments}
          activeWeeks={activeWeeks}
          onCellClick={handleCellClick}
          onEventClick={handleEventClick}
        />
      )}
      <EventModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingEvent(null)
        }}
        onSave={handleSave}
        onDelete={handleDelete}
        event={editingEvent}
        defaultDate={defaultDate}
        defaultDepartment={defaultDepartment}
      />
    </div>
  )
}
