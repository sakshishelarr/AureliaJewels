'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import caro1 from '@/images/caro1.jpg';
import caro2 from '@/images/caro2.jpg';
import caro3 from '@/images/caro3.jpg';
import caro4 from '@/images/caro4.jpg';
import caro5 from '@/images/caro5.jpg';

type Item = {
  title: string
  href: string
  image: string
  cta?: string
}

const ITEMS: Item[] = [
  {
    title: 'My Embrace',
    href: '/products?category=necklaces',
    image: caro1.src,
    cta: 'Explore',
  },
  {
    title: 'Truly Brave',
    href: '/products?category=earrings',
    image:caro2.src,
    cta: 'Discover',
  },
  {
    title: 'Celestial Muse',
    href: '/products?category=rings',
    image:caro3.src,
    cta: 'See more',
  },
  {
    title: 'Luxe Brace',
    href: '/products?category=bracelets',
    image:caro4.src,
    cta: 'Shop now',
  },
  {
    title: 'Pearl Reverie',
    href: '/products?category=necklaces',
    image:caro5.src,
  },
]

// Positions relative to the active slide.
//  0: active (center, biggest)
//  1: next
//  2: next-next
//  3: next-next-next
// -1: previous (kept for exiting animation)
// others: hidden
function positionOf(i: number, active: number, len: number) {
  const diff = (i - active + len) % len
  if (diff === 0) return 0
  if (diff === 1) return 1
  if (diff === 2) return 2
  if (diff === 3) return 3
  // for a little exit animation, consider previous index too
  if ((active - i + len) % len === 1) return -1
  return 99 // hidden
}

export default function ShowcaseCarousel({
  items = ITEMS,
  interval = 3500,
}: {
  items?: Item[]
  interval?: number
}) {
  const [active, setActive] = useState(0)
  const [isHover, setIsHover] = useState(false)
  const timer = useRef<number | null>(null)

  const data = useMemo(() => items, [items])

  useEffect(() => {
    if (isHover) {
      if (timer.current) window.clearInterval(timer.current)
      return
    }
    timer.current = window.setInterval(() => {
      setActive((a) => (a + 1) % data.length)
    }, interval)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [data.length, interval, isHover])

  const prev = () => setActive((a) => (a - 1 + data.length) % data.length)
  const next = () => setActive((a) => (a + 1) % data.length)

  return (
    <section className="bg-[#f8f6f2] pt-0 pb-16">
      <div className="container mx-auto px-4 max-h-[425px]">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
        {/* Left copy / header */}
        <div className="lg:col-span-2">
          <h2 className="font-playfair text-3xl md:text-4xl text-black">
            Our Collections
          </h2>
          <p className="mt-4 text-gray-600 max-w-md">
            A rotating showcase of featured series. Hover to pause, swipe or use
            arrows to explore.
          </p>

          <div className="hidden md:flex gap-3 mt-8">
            <button
              onClick={prev}
              aria-label="Previous"
              className="h-10 w-10 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="h-10 w-10 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
              ›
            </button>
          </div>
        </div>

        {/* Stage */}
        <div className="lg:col-span-3 relative h-[460px] md:h-[425px] -ml-8">
          {data.map((item, i) => {
            const pos = positionOf(i, active, data.length)

            // class recipes for each layer
            const base =
              'absolute inset-0 w-[80%] left-[10%] rounded-2xl overflow-hidden luxury-shadow transition-all duration-700 ease-[cubic-bezier(.2,.65,.25,1)] will-change-transform'
            const layers: Record<number, string> = {
              0: 'z-40 scale-100 translate-x-0 opacity-100',
              1: 'z-30 scale-[0.9] translate-x-[8%] md:translate-x-[12%] translate-y-[6%] opacity-95',
              2: 'z-20 scale-[0.78] translate-x-[18%] md:translate-x-[24%] translate-y-[12%] opacity-90',
              3: 'z-10 scale-[0.68] translate-x-[26%] md:translate-x-[34%] translate-y-[18%] opacity-85',
              [-1]: 'z-10 scale-[0.9] -translate-x-[8%] md:-translate-x-[12%] translate-y-[6%] opacity-0',
            }

            const cls =
              pos === 99
                ? 'hidden'
                : `${base} ${layers[pos] ?? 'hidden'} bg-black/5`

            return (
              <Link href={item.href} className={cls} key={i}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={pos === 0}
                />
                {/* Gradient + text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />
                <div className="absolute left-5 bottom-5 text-white">
                  <h3 className="font-playfair text-xl md:text-2xl font-semibold drop-shadow">
                    {item.title.toUpperCase()}
                  </h3>
                  {item.cta && (
                    <span className="inline-block mt-2 text-sm text-white/90 underline decoration-white/60 underline-offset-4">
                      {item.cta}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}

          {/* Mobile arrows overlay */}
          <div className="sm:hidden absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
            <button
              onClick={prev}
              aria-label="Previous"
              className="h-9 w-9 rounded-full border border-gray-300 bg-white/80 backdrop-blur hover:bg-white transition"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="h-9 w-9 rounded-full border border-gray-300 bg-white/80 backdrop-blur hover:bg-white transition"
            >
              ›
            </button>
          </div>

          {/* Pagination lines */}
            <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center gap-2">
            {data.map((_, i) => (
                <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={[
                    // shape
                    'h-[3px] rounded-full',
                    // animation
                    'transition-all duration-300',
                    // width + color by state
                    i === active ? 'w-10 bg-softgold opacity-100' : 'w-6 bg-black/20 opacity-60',
                    // accessibility focus
                    'focus:outline-none focus:ring-2 focus:ring-softgold/40',
                ].join(' ')}
                />
            ))}
            </div>

        </div>
        </div>
      </div>
    </section>
  )
}
