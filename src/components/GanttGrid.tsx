'use client'

import { useMemo } from 'react'
import { DEPARTMENTS, DEPARTMENT_ORDER, HEBREW_DAY_NAMES } from '@/lib/constants'
import { GanttEvent, Department } from '@/lib/types'
import EventChip from './EventChip'

interface GanttGridProps {
  year: number
  month: number
  events: GanttEvent[]
  activeDepartments: Set<Department>
  activeWeeks: Set<number>
  onCellClick: (date: string, department: Department) => void
  onEventClick: (event: GanttEvent) => void
}

interface DayInfo {
  num: number
  dayOfWeek: number
  dateStr: string
  dayName: string
  isToday: boolean
  isShabbat: boolean
}

export default function GanttGrid({
  year,
  month,
  events,
  activeDepartments,
  activeWeeks,
  onCellClick,
  onEventClick,
}: GanttGridProps) {
  const daysInMonth = new Date(year, month, 0).getDate()
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  // Build all days
  const allDays = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      const dayNum = i + 1
      const dateObj = new Date(year, month - 1, dayNum)
      const dayOfWeek = dateObj.getDay()
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
      return {
        num: dayNum,
        dayOfWeek,
        dateStr,
        dayName: HEBREW_DAY_NAMES[dayOfWeek],
        isToday: dateStr === todayStr,
        isShabbat: dayOfWeek === 6,
      }
    })
  }, [year, month, daysInMonth, todayStr])

  // Group days into weeks (Sun-Sat)
  const weeks = useMemo(() => {
    const result: DayInfo[][] = []
    let currentWeek: DayInfo[] = []

    // Pad start of first week with nulls
    const firstDayOfWeek = allDays[0].dayOfWeek
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null as unknown as DayInfo)
    }

    for (const day of allDays) {
      currentWeek.push(day)
      if (day.dayOfWeek === 6) {
        result.push(currentWeek)
        currentWeek = []
      }
    }

    // Push remaining days
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null as unknown as DayInfo)
      }
      result.push(currentWeek)
    }

    return result
  }, [allDays])

  // Index events by date+department
  const eventMap = useMemo(() => {
    const map: Record<string, GanttEvent[]> = {}
    for (const ev of events) {
      const key = `${ev.date}|${ev.department}`
      if (!map[key]) map[key] = []
      map[key].push(ev)
    }
    return map
  }, [events])

  const activeDepts = DEPARTMENT_ORDER.filter((d) => activeDepartments.has(d))

  return (
    <div className="flex-1 overflow-auto bg-white">
      {/* Day names header - fixed */}
      <div
        className="sticky top-0 z-30 grid border-b-2 border-party-blue"
        style={{ gridTemplateColumns: '130px repeat(7, 1fr)' }}
      >
        <div className="bg-party-blue text-white font-bold text-sm flex items-center justify-center py-2">
          מחלקה
        </div>
        {HEBREW_DAY_NAMES.map((name, i) => (
          <div
            key={i}
            className={`bg-party-blue text-white text-center py-2 text-sm font-bold border-r border-white/20 ${i === 6 ? 'opacity-70' : ''}`}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Week blocks */}
      {weeks.map((week, weekIdx) => {
        if (!activeWeeks.has(weekIdx)) return null
        const validDays = week.filter(Boolean)
        const weekStart = validDays[0]?.num
        const weekEnd = validDays[validDays.length - 1]?.num
        const weekLabel = weekStart === weekEnd ? `${weekStart}` : `${weekStart}-${weekEnd}`

        return (
          <div key={weekIdx} className="border-b-2 border-gray-300">
            {/* Week date header row */}
            <div
              className="grid bg-gray-100 border-b border-gray-200"
              style={{ gridTemplateColumns: '130px repeat(7, 1fr)' }}
            >
              <div className="text-xs font-bold text-gray-500 flex items-center justify-center py-1.5">
                {weekLabel}
              </div>
              {week.map((day, dayIdx) => (
                <div
                  key={dayIdx}
                  className={`text-center py-1.5 text-sm font-bold border-r border-gray-200 ${
                    day?.isToday
                      ? 'bg-party-orange text-white'
                      : day?.isShabbat
                        ? 'bg-gray-200 text-gray-500'
                        : 'text-gray-700'
                  } ${!day ? 'bg-gray-50' : ''}`}
                >
                  {day ? day.num : ''}
                </div>
              ))}
            </div>

            {/* Department rows for this week */}
            {activeDepts.map((dept) => {
              const info = DEPARTMENTS[dept]
              return (
                <div
                  key={dept}
                  className="grid border-b border-gray-100"
                  style={{ gridTemplateColumns: '130px repeat(7, 1fr)' }}
                >
                  {/* Department label */}
                  <div
                    className="flex items-center gap-1.5 px-2 py-1 font-bold text-xs bg-white border-l border-gray-200"
                    style={{ borderRight: `4px solid ${info.color}` }}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: info.color }}
                    />
                    <span className="truncate">{info.name}</span>
                  </div>

                  {/* Day cells */}
                  {week.map((day, dayIdx) => {
                    if (!day) {
                      return (
                        <div
                          key={dayIdx}
                          className="border-r border-gray-100 bg-gray-50 min-h-[36px]"
                        />
                      )
                    }
                    const key = `${day.dateStr}|${dept}`
                    const cellEvents = eventMap[key] || []
                    return (
                      <div
                        key={day.dateStr}
                        onClick={() => onCellClick(day.dateStr, dept)}
                        className={`border-r border-gray-100 min-h-[36px] p-0.5 cursor-pointer flex flex-col gap-0.5 hover:bg-blue-50/50 transition-colors ${
                          day.isToday ? 'bg-party-blue-light' : ''
                        } ${day.isShabbat ? 'bg-gray-50' : ''}`}
                      >
                        {cellEvents.map((ev) => (
                          <EventChip key={ev.id} event={ev} onClick={onEventClick} />
                        ))}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
