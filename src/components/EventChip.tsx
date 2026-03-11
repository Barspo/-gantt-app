'use client'

import { DEPARTMENTS } from '@/lib/constants'
import { GanttEvent } from '@/lib/types'

interface EventChipProps {
  event: GanttEvent
  onClick: (event: GanttEvent) => void
}

export default function EventChip({ event, onClick }: EventChipProps) {
  const dept = DEPARTMENTS[event.department]

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick(event)
      }}
      className="w-full text-right px-1.5 py-0.5 rounded text-[11px] leading-tight font-medium transition-all hover:shadow-md cursor-pointer border-r-2 whitespace-normal break-words"
      style={{
        backgroundColor: dept.lightColor,
        borderRightColor: dept.color,
        color: '#333',
      }}
      title={event.details || event.title}
    >
      {event.title}
    </button>
  )
}
