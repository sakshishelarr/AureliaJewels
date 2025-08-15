'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import necklaceImg from '@/images/necklace.jpg'
import ringImg from '@/images/ring.jpg'
import earringImg from '@/images/earring.jpg'

type Card = {
  title: 'Necklaces' | 'Earrings' | 'Rings';
  blurb: string;
  href: string;
  image: string;
  accent: string; // Tailwind color token for the small pill
};

const CARDS: Card[] = [
  {
    title: 'Necklaces',
    blurb: 'A stunning diamond necklace that embodies sophistication.',
    href: '/products?category=necklaces',
    image:necklaceImg.src,
    accent: 'bg-emerald',
  },
  {
    title: 'Rings',
    blurb: 'A captivating ring featuring a brilliant centrepiece.',
    href: '/products?category=rings',
    image:ringImg.src,
    accent: 'bg-softgold',
  },
  {
    title: 'Earrings',
    blurb: 'Timeless earrings with lustrous freshwater pearls.',
    href: '/products?category=earrings',
    image:earringImg.src,
    accent: 'bg-rosegold',
  },
];

export default function CategoryShowcase() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  // reveal on scroll
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#F8F4ED] pt-8">
        <div className="absolute inset-0 bg-gradient-to-b from-champagne/30 via-alabaster to-[#F8F4ED] pointer-events-none" />
        {/* content wrapper sits above gradient */}
      <div className="relative container mx-auto px-4">
        <div ref={rootRef} className="mb-8">
          <p className="uppercase tracking-widest text-sm text-gray-500">
            Timeless Elegance
          </p>
          <h2 className="font-playfair text-3xl md:text-4xl text-black mt-2">
            Discover our exquisite collections.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {CARDS.map((card, i) => (
            <Link
              key={card.title}
              href={card.href}
              className={[
                'group relative overflow-hidden rounded-2xl bg-white luxury-shadow',
                'transition-all duration-500 ease-out',
                'hover:-translate-y-1 hover:shadow-2xl',
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
              ].join(' ')}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="relative aspect-[16/11]">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={i === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className={`inline-block h-2 w-2 rounded-full ${card.accent}`} />
                  <span>Shop now</span>
                </div>

                <h3 className="mt-2 text-xl font-semibold text-black">{card.title}</h3>
                <p className="mt-1 text-gray-600 text-sm leading-relaxed">{card.blurb}</p>

                <div className="mt-4 inline-flex items-center gap-2 text-softgold font-medium">
                  Explore
                  <span className="transition-transform group-hover:translate-x-1">›</span>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-x-0 -bottom-12 h-24 blur-2xl bg-softgold/15" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}