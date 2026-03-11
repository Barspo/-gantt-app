import Image from 'next/image'
import CountdownTimer from './CountdownTimer'

export default function Header() {
  return (
    <header className="bg-party-blue text-white shadow-lg">
      <div className="max-w-[1800px] mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/logo.png"
            alt="יש עתיד"
            width={120}
            height={36}
            className="brightness-0 invert"
            priority
          />
          <div className="h-8 w-px bg-white/20" />
          <h1 className="text-lg font-bold">גאנט פעילות 2026</h1>
        </div>
        <CountdownTimer />
      </div>
    </header>
  )
}
