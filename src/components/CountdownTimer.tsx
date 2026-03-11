'use client'

import { useState, useEffect } from 'react'
import { ELECTION_DATE } from '@/lib/constants'

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())

  function getTimeLeft() {
    const now = new Date()
    const diff = ELECTION_DATE.getTime() - now.getTime()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    }
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center gap-3">
      <span className="text-white/70 text-sm">הבחירות בעוד</span>
      <div className="flex items-center gap-1.5" dir="ltr">
        <TimeUnit value={timeLeft.days} label="ימים" />
        <span className="text-party-orange text-lg font-bold">:</span>
        <TimeUnit value={timeLeft.hours} label="שעות" />
        <span className="text-party-orange text-lg font-bold">:</span>
        <TimeUnit value={timeLeft.minutes} label="דקות" />
        <span className="text-party-orange text-lg font-bold">:</span>
        <TimeUnit value={timeLeft.seconds} label="שניות" />
      </div>
    </div>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-party-orange font-bold text-xl tabular-nums leading-none">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-white/50 text-[10px] leading-none mt-0.5">{label}</span>
    </div>
  )
}
