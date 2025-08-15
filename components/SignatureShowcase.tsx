'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'

type ShowcaseItem = {
  title: string
  subtitle?: string
  href: string
  image: string
  badge?: string
}

export default function SignatureShowcase({
  items,
  heading = 'Signature Showcase',
  subheading = 'An edit of our most coveted pieces — curated for timeless elegance.',
}: {
  items?: ShowcaseItem[]
  heading?: string
  subheading?: string
}) {
  // Fallback curation if no data is passed in
  const data = useMemo<ShowcaseItem[]>(
    () =>
      items?.length
        ? items
        : [
            {
              title: 'Ethereal Halo',
              subtitle: 'Diamond solitaire ring',
              href: '/products?category=rings',
              image:
                'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1600&auto=format&fit=crop',
              badge: 'Iconic',
            },
            {
              title: 'Lumière',
              subtitle: 'Pearl drop earrings',
              href: '/products?category=earrings',
              image:
                'https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1600&auto=format&fit=crop',
              badge: 'New',
            },
            {
              title: 'Aurora Line',
              subtitle: 'Diamond tennis bracelet',
              href: '/products?category=bracelets',
              image:
                'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1600&auto=format&fit=crop',
            },
            {
              title: 'Celeste',
              subtitle: 'Sculpted gold necklace',
              href: '/products?category=necklaces',
              image:
                'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1600&auto=format&fit=crop',
            },
          ],
    [items]
  )

  return (
    <section className="relative overflow-hidden">
      {/* soft backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-champagne/30 via-alabaster to-white pointer-events-none" />

      <div className="container mx-auto px-4 py-16 relative">
        <header className="text-center mb-10">
          <p className="tracking-[.2em] text-sm text-gray-500">TIMELESS ELEGANCE</p>
          <h2 className="font-playfair text-3xl md:text-5xl text-black mt-2">{heading}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">{subheading}</p>
        </header>

        {/* Mosaic */}
        <div className="grid grid-cols-12 gap-5 max-w-6xl mx-auto">
          {/* Large feature */}
          <Card
            item={data[0]}
            className="col-span-12 md:col-span-7 h-[360px] md:h-[480px]"
          />

          {/* Tall right */}
          <Card
            item={data[1]}
            className="col-span-12 md:col-span-5 h-[360px] md:h-[480px]"
          />

          {/* Two bottom squares */}
          <Card
            item={data[2]}
            className="col-span-12 md:col-span-6 h-[300px]"
          />
          <Card
            item={data[3]}
            className="col-span-12 md:col-span-6 h-[300px]"
          />
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-block rounded-2xl bg-black text-white px-6 py-3 font-medium tracking-wide hover:bg-black/90 transition luxury-shadow"
          >
            Shop the edit
          </Link>
          <p className="text-xs text-gray-500 mt-3">Free shipping • Lifetime warranty • Crafted with care</p>
        </div>
      </div>

      {/* Subtle floating sparkles */}
      <style jsx>{`
        .sparkle:before,
        .sparkle:after {
          content: '';
          position: absolute;
          background: radial-gradient(closest-side, rgba(255,255,255,.8), transparent);
          width: 120px;
          height: 120px;
          filter: blur(10px);
          animation: float 9s ease-in-out infinite;
          pointer-events: none;
        }
        .sparkle:before { top: -40px; left: -40px; animation-delay: 1.2s; }
        .sparkle:after { bottom: -50px; right: -60px; animation-delay: 3.2s; }
        @keyframes float {
          0%,100% { transform: translate3d(0,0,0) scale(1); opacity: .35; }
          50% { transform: translate3d(10px, -8px, 0) scale(1.05); opacity: .55; }
        }
      `}</style>
    </section>
  )
}

function Card({
  item,
  className = '',
}: {
  item: ShowcaseItem
  className?: string
}) {
  return (
    <Link
      href={item.href}
      className={`group relative rounded-3xl overflow-hidden bg-white/50 backdrop-blur-sm ring-1 ring-black/5 luxury-shadow sparkle ${className}`}
    >
      <Image
        src={item.image}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        sizes="(max-width:768px) 100vw, 50vw"
        priority={false}
      />

      {/* gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

      {/* badge */}
      {item.badge && (
        <span className="absolute top-4 left-4 z-[2] rounded-full bg-white/90 px-3 py-1 text-xs font-medium tracking-wide">
          {item.badge}
        </span>
      )}

      {/* copy */}
      <div className="absolute left-5 right-5 bottom-5 text-white drop-shadow">
        <h3 className="font-playfair text-2xl md:text-3xl">{item.title}</h3>
        {item.subtitle && (
          <p className="text-white/85 text-sm mt-1">{item.subtitle}</p>
        )}

        <span className="inline-flex items-center gap-2 mt-3 text-sm font-medium">
          Discover
          <svg
            className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </span>
      </div>
    </Link>
  )
}
