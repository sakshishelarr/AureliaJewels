// components/LuxePerksRow.tsx
import React from 'react'

/** Shared gold gradient stop colors (subtle, not yellowy) */
const GOLD_A = '#E7D8B1'
const GOLD_B = '#C6A25D'

/* ===== Icons (inline SVG, thin strokes, luxe gold gradient) ===== */

function GoldCamera({ className = 'h-10 w-10' }: { className?: string }) {
  const id = 'goldCam'
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="24" y2="24">
          <stop offset="0%" stopColor={GOLD_A} />
          <stop offset="100%" stopColor={GOLD_B} />
        </linearGradient>
      </defs>
      <rect x="3" y="7" width="18" height="12" rx="3" stroke={`url(#${id})`} strokeWidth="1.6" />
      <path d="M9 7l1.2-2h3.6L15 7" stroke={`url(#${id})`} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="13" r="3.5" stroke={`url(#${id})`} strokeWidth="1.6" />
      <circle cx="18.2" cy="10.5" r="0.8" fill={`url(#${id})`} />
    </svg>
  )
}

function GoldTruck({ className = 'h-10 w-10' }: { className?: string }) {
  const id = 'goldTruck'
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="24" y2="24">
          <stop offset="0%" stopColor={GOLD_A} />
          <stop offset="100%" stopColor={GOLD_B} />
        </linearGradient>
      </defs>
      <rect x="3" y="7" width="11" height="8" rx="1.5" stroke={`url(#${id})`} strokeWidth="1.6" />
      <path d="M14 10h3.4c.4 0 .8.2 1 .6l1.2 2.4c.1.2.2.5.2.7V15H14v-5z" stroke={`url(#${id})`} strokeWidth="1.6" />
      <circle cx="8" cy="16.5" r="1.8" stroke={`url(#${id})`} strokeWidth="1.6" />
      <circle cx="18" cy="16.5" r="1.8" stroke={`url(#${id})`} strokeWidth="1.6" />
    </svg>
  )
}

function GoldGem({ className = 'h-10 w-10' }: { className?: string }) {
  const id = 'goldGem'
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="24" y2="24">
          <stop offset="0%" stopColor={GOLD_A} />
          <stop offset="100%" stopColor={GOLD_B} />
        </linearGradient>
      </defs>
      <path d="M7 4h10l4 5-9 11L3 9l4-5z" stroke={`url(#${id})`} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7 4l5 6 5-6M3 9h18M12 10v10" stroke={`url(#${id})`} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function GoldCardClock({ className = 'h-10 w-10' }: { className?: string }) {
  const id = 'goldPay'
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="24" y2="24">
          <stop offset="0%" stopColor={GOLD_A} />
          <stop offset="100%" stopColor={GOLD_B} />
        </linearGradient>
      </defs>
      <rect x="3" y="6.5" width="14" height="9" rx="1.8" stroke={`url(#${id})`} strokeWidth="1.6" />
      <path d="M4.5 9h11" stroke={`url(#${id})`} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="18.5" cy="14.5" r="4" stroke={`url(#${id})`} strokeWidth="1.6" />
      <path d="M18.5 12.8v1.9l1.3.7" stroke={`url(#${id})`} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

/* ===== Single perk ===== */

function LuxePerk({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="flex flex-col items-center text-center gap-4">
      <div className="h-20 w-20 rounded-full bg-white/60 border border-[#eadfcf] shadow-[0_8px_24px_rgba(198,162,93,0.18)] backdrop-blur-sm flex items-center justify-center">
        {icon}
      </div>
      <h4 className="font-playfair text-lg font-semibold tracking-wide text-black">
        {title}
      </h4>
      <p className="text-gray-600 text-sm max-w-xs leading-relaxed">{desc}</p>
    </div>
  )
}

/* ===== Row wrapper ===== */

export default function LuxePerksRow() {
  return (
    <section className="bg-[#F8F4ED]">
        
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          <LuxePerk
            icon={<GoldCamera />}
            title="Shop by picture"
            desc="Upload a photo and we’ll find similar pieces—perfect for inspiration screenshots."
          />
          <LuxePerk
            icon={<GoldTruck />}
            title="Free delivery"
            desc="Complimentary shipping on all orders. Next-day available on select items."
          />
          <LuxePerk
            icon={<GoldGem />}
            title="Responsibly sourced"
            desc="Every gem is selected with care and traceability, crafted with integrity."
          />
          <LuxePerk
            icon={<GoldCardClock />}
            title="Pay later options"
            desc="Flexible checkout with leading pay-later providers. Use responsibly."
          />
        </div>
      </div>
    </section>
  )
}
