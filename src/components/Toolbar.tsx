'use client'

import { ChevronRight, ChevronLeft, Plus, Calendar } from 'lucide-react'
import { DEPARTMENTS, DEPARTMENT_ORDER, HEBREW_MONTH_NAMES } from '@/lib/constants'
import { Department } from '@/lib/types'

interface WeekInfo {
  weekIdx: number
  label: string
  containsToday: boolean
}

interface ToolbarProps {
  year: number
  month: number
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
  onAddEvent: () => void
  activeDepartments: Set<Department>
  onToggleDepartment: (dept: Department) => void
  weekInfos: WeekInfo[]
  activeWeeks: Set<number>
  onToggleWeek: (weekIdx: number) => void
}

export default function Toolbar({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  onToday,
  onAddEvent,
  activeDepartments,
  onToggleDepartment,
  weekInfos,
  activeWeeks,
  onToggleWeek,
}: ToolbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1800px] mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="חודש קודם"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold min-w-[160px] text-center">
            {HEBREW_MONTH_NAMES[month - 1]} {year}
          </h2>
          <button
            onClick={onNextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="חודש הבא"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onToday}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mr-2"
          >
            <Calendar className="w-4 h-4" />
            היום
          </button>
        </div>

        {/* Department Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {DEPARTMENT_ORDER.map((dept) => {
            const info = DEPARTMENTS[dept]
            const isActive = activeDepartments.has(dept)
            return (
              <button
                key={dept}
                onClick={() => onToggleDepartment(dept)}
                className="px-3 py-1.5 rounded-full text-sm font-medium transition-all border"
                style={{
                  backgroundColor: isActive ? info.color : 'transparent',
                  color: isActive ? 'white' : info.color,
                  borderColor: info.color,
                  opacity: isActive ? 1 : 0.6,
                }}
              >
                {info.name}
              </button>
            )
          })}
          <span className="w-px h-6 bg-gray-300 mx-1" />
          {/* Week Filters */}
          {weekInfos.map((week) => {
            const isActive = activeWeeks.has(week.weekIdx)
            return (
              <button
                key={week.weekIdx}
                onClick={() => onToggleWeek(week.weekIdx)}
                className={`px-2.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  isActive
                    ? week.containsToday
                      ? 'bg-party-orange text-white border-party-orange'
                      : 'bg-party-blue text-white border-party-blue'
                    : 'bg-transparent text-gray-500 border-gray-300 opacity-60'
                }`}
              >
                {week.label}
              </button>
            )
          })}
        </div>

        {/* Add Event Button */}
        <button
          onClick={onAddEvent}
          className="flex items-center gap-2 px-4 py-2 bg-party-orange text-white rounded-lg hover:bg-party-orange-hover transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          אירוע חדש
        </button>
      </div>
    </div>
  )
}
