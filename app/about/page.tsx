'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

/* ----------------------------- tiny fade-in ----------------------------- */
function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        io.disconnect()
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1, ...options })
    io.observe(el)
    return () => io.disconnect()
  }, [options])
  return { ref, visible }
}

/* ------------------------------ page begins ----------------------------- */
export default function AboutPage() {
  return (
    <main className="bg-white text-gray-900">
      {/* HERO */}
      <header className="relative overflow-hidden">
        {/* gentle glow */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-softgold/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-16 h-96 w-96 rounded-full bg-champagne/30 blur-3xl" />

        <div className="relative container mx-auto px-4 pt-24 pb-20 md:pt-28 md:pb-24">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="tracking-[.25em] text-xs text-gray-500">
                SINCE 1998
              </p>
              <h1 className="mt-3 font-playfair text-4xl leading-tight md:text-6xl text-black">
                Crafted for a lifetime.<br />
                <span className="bg-gradient-to-r from-[#E7D8B1] via-[#D3B978] to-[#C6A25D] bg-clip-text text-transparent">
                  Designed to be remembered.
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-gray-600">
                At <span className="font-medium text-black">Aurelia Jewels</span>, we marry
                old-world artistry with modern finesse. Every piece passes through the
                hands of master artisans — cut, set, and polished to catch light the way
                the heart does: softly, endlessly.
              </p>

              <div className="mt-7 flex gap-3">
                <Link
                  href="/products"
                  className="inline-block rounded-2xl bg-black px-6 py-3 text-white shadow-md transition hover:bg-black/90"
                >
                  Explore the Collection
                </Link>
                <a
                  href="#our-story"
                  className="inline-flex items-center gap-2 rounded-2xl border border-black/10 px-6 py-3 text-sm text-gray-800 hover:border-softgold hover:text-softgold transition"
                >
                  Our Story
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7l8 5-8 5" />
                  </svg>
                </a>
              </div>
            </div>

            {/* hero image */}
            <div className="relative h-[360px] w-full overflow-hidden rounded-3xl ring-1 ring-black/5 md:h-[460px]">
              <Image
                src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1600&auto=format&fit=crop"
                alt="Gold ring on marble"
                fill
                className="object-cover scale-105 will-change-transform"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-transparent" />
            </div>
          </div>
        </div>
      </header>

      {/* MARQUEE — press/awards */}
      <Marquee />

      {/* OUR STORY */}
      <Story />

      {/* TIMELINE */}
      <Timeline />

      {/* CRAFTSMANSHIP VALUES */}
      <Values />

      {/* SIGNATURE MATERIALS */}
      <Materials />

      {/* TESTIMONIAL */}
      <Quote />

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#F8F4ED]">
        <div className="container mx-auto px-4 py-16 md:py-20 text-center">
          <p className="tracking-[.25em] text-xs text-gray-500">INVITATION</p>
          <h3 className="mt-2 font-playfair text-3xl md:text-5xl text-black">
            Begin your Aurelia chapter
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Whether you’re celebrating a first or a forever — discover jewelry that carries
            memory like light.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/products"
              className="rounded-2xl bg-softgold px-6 py-3 text-white shadow-sm transition hover:bg-softgold/90"
            >
              Shop Now
            </Link>
            <Link
              href="/products?sort=newest"
              className="rounded-2xl border border-black/10 px-6 py-3 text-gray-900 transition hover:border-softgold hover:text-softgold"
            >
              New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* small page styles */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee 22s linear infinite;
        }
      `}</style>
    </main>
  )
}

/* ------------------------------- components ------------------------------ */

function Marquee() {
  // simple text logos; replace with SVGs if you have them
  const items = ['Vogue', 'Harper’s Bazaar', 'Elle', 'Tatler', 'GQ', 'Forbes']
  return (
    <section aria-label="Press & Awards" className="border-y border-black/5 bg-alabaster/60">
      <div className="container mx-auto overflow-hidden px-4 py-6">
        <div className="marquee-track flex min-w-[200%] gap-10 whitespace-nowrap opacity-80">
          {[...items, ...items].map((name, i) => (
            <span
              key={i}
              className="font-playfair text-lg tracking-wide text-gray-700"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function Story() {
  const left = useInView<HTMLDivElement>()
  const right = useInView<HTMLDivElement>()
  return (
    <section id="our-story" className="relative overflow-hidden">
      <div className="container mx-auto grid items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-20">
        <div
          ref={left.ref}
          className={[
            'transition duration-700',
            left.visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
          ].join(' ')}
        >
          <p className="tracking-[.25em] text-xs text-gray-500">OUR STORY</p>
          <h2 className="mt-2 font-playfair text-3xl text-black md:text-5xl">
            From atelier to heirloom
          </h2>
          <p className="mt-4 max-w-xl text-gray-600">
            Aurelia began as a tiny atelier nestled in the old gold district. We believed
            that the most meaningful pieces weren’t just worn — they were kept, borrowed,
            whispered about and eventually passed on.
          </p>
          <p className="mt-3 max-w-xl text-gray-600">
            Today, our workshops blend hand techniques with exacting modern standards.
            Stones are traceable; metals responsibly sourced; settings tested across
            decades, not seasons.
          </p>

          <dl className="mt-6 grid grid-cols-3 gap-4 text-center">
            <Stat title="Years" value="25+" />
            <Stat title="Master artisans" value="60+" />
            <Stat title="Countries shipped" value="40+" />
          </dl>
        </div>

        <div
          ref={right.ref}
          className={[
            'relative h-[360px] overflow-hidden rounded-3xl ring-1 ring-black/5 md:h-[500px]',
            'transition duration-700',
            right.visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
          ].join(' ')}
        >
          <Image
            src='/images/worker.jpg'
            alt="Bench jeweler at work"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-transparent" />
        </div>
      </div>
    </section>
  )
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/70 px-4 py-5 ring-1 ring-black/5">
      <div className="font-playfair text-2xl text-black">{value}</div>
      <div className="text-xs tracking-widest text-gray-500">{title}</div>
    </div>
  )
}

function Timeline() {
  const { ref, visible } = useInView<HTMLDivElement>()
  const nodes = [
    { year: '1998', text: 'The atelier opens with three benches and a single polishing barrel.' },
    { year: '2006', text: 'Sustainable sourcing program launches with audited suppliers.' },
    { year: '2015', text: 'Signature Aureline™ setting debuts — engineered for light return.' },
    { year: '2023', text: 'Global flagship opens; bespoke studio expands.' },
  ]
  return (
    <section ref={ref} className="bg-gradient-to-b from-white to-[#F8F4ED]">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <h3 className="text-center font-playfair text-3xl text-black md:text-5xl">Our Journey</h3>

        <div className="relative mx-auto mt-10 max-w-4xl">
          {/* line */}
          <div className="absolute left-6 top-0 h-full w-[2px] bg-gradient-to-b from-softgold/70 to-transparent md:left-1/2" />
          {/* items */}
          <div className="space-y-10 md:space-y-14">
            {nodes.map((n, i) => (
              <div
                key={i}
                className={[
                  'relative grid items-center gap-4 md:grid-cols-2',
                  i % 2 === 0 ? 'md:text-right' : 'md:text-left',
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
                  'transition duration-700',
                ].join(' ')}
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div className={i % 2 ? 'order-2 md:order-1' : 'order-2'}>
                  <div className="font-playfair text-2xl text-black">{n.year}</div>
                  <p className="mt-1 text-gray-600">{n.text}</p>
                </div>
                <div className={i % 2 ? 'order-1 md:order-2' : 'hidden md:block'} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Values() {
  const { ref, visible } = useInView<HTMLDivElement>()
  const Card = ({
    title,
    desc,
    icon,
  }: { title: string; desc: string; icon: React.ReactNode }) => (
    <div
      className={[
        'rounded-3xl bg-white/70 p-6 ring-1 ring-black/5 transition duration-700',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      ].join(' ')}
    >
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/60 ring-1 ring-[#eadfcf]">
        {icon}
      </div>
      <h4 className="font-playfair text-xl text-black">{title}</h4>
      <p className="mt-2 text-gray-600">{desc}</p>
    </div>
  )

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <h3 className="text-center font-playfair text-3xl text-black md:text-5xl">
          The Aurelia Standard
        </h3>
        <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
          Quiet luxury is a discipline. These are the pillars we never compromise.
        </p>

        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          <Card
            title="Responsible Sourcing"
            desc="Traceable stones, audited partners, recycled gold — beauty without cost to the earth."
            icon={<GoldGem className="h-7 w-7" />}
          />
          <Card
            title="Lifetime Promise"
            desc="Complimentary cleaning, prong checks and resizing — your pieces, cared for forever."
            icon={<GoldShield className="h-7 w-7" />}
          />
          <Card
            title="Bespoke Craft"
            desc="One-of-a-kind designs, uniquely yours. Our studio brings your story to form."
            icon={<GoldFeather className="h-7 w-7" />}
          />
        </div>
      </div>
    </section>
  )
}

function Materials() {
  const left = useInView<HTMLDivElement>()
  const right = useInView<HTMLDivElement>()
  return (
    <section className="bg-alabaster/60">
      <div className="container mx-auto grid items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-20">
        <div
          ref={left.ref}
          className={[
            'relative h-[340px] overflow-hidden rounded-3xl ring-1 ring-black/5 md:h-[460px] transition duration-700',
            left.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
          ].join(' ')}
        >
          <Image
            src='/images/stones.jpg'
            alt="Precious stones"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-transparent" />
        </div>

        <div
          ref={right.ref}
          className={[
            'transition duration-700',
            right.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
          ].join(' ')}
        >
          <p className="tracking-[.25em] text-xs text-gray-500">SIGNATURE MATERIALS</p>
          <h3 className="mt-2 font-playfair text-3xl text-black md:text-5xl">
            Light, metal, memory
          </h3>
          <p className="mt-4 max-w-xl text-gray-600">
            Our diamonds are graded for fire and balance; our pearls hand-selected for
            luster; our alloys engineered in-house for a warmer hue that flatters every
            skin tone.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-gray-700">
            <li>• Conflict-free diamonds & fully traceable gemstones</li>
            <li>• Recycled 18K gold & platinum options</li>
            <li>• Hypoallergenic, nickel-safe settings</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function Quote() {
  const { ref, visible } = useInView<HTMLDivElement>()
  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div
          className={[
            'mx-auto max-w-3xl rounded-3xl bg-white/70 p-8 text-center ring-1 ring-black/5 backdrop-blur',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
            'transition duration-700',
          ].join(' ')}
        >
          <svg className="mx-auto mb-4 h-6 w-6 text-softgold" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.17 6A5.17 5.17 0 0 0 2 11.17V22h8V12H6.83c.21-2.21 1.54-3.33 3.17-3.33V6H7.17zm9.66 0A5.17 5.17 0 0 0 11.66 11.17V22h8V12h-3.17c.21-2.21 1.54-3.33 3.17-3.33V6h-3.83z" />
          </svg>
          <blockquote className="font-playfair text-2xl leading-relaxed text-black md:text-3xl">
            “There’s a quiet confidence to Aurelia — pieces that never shout, but are
            always noticed.”
          </blockquote>
          <p className="mt-3 text-sm text-gray-600">— A customer note, 2024</p>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- gold line icons ---------------------------- */

function GoldGem({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="24" y2="24">
          <stop offset="0%" stopColor="#E7D8B1" />
          <stop offset="100%" stopColor="#C6A25D" />
        </linearGradient>
      </defs>
      <path d="M7 4h10l4 5-9 11L3 9l4-5z" stroke="url(#g1)" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7 4l5 6 5-6M3 9h18M12 10v10" stroke="url(#g1)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function GoldShield({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="g2" x1="0" y1="0" x2="24" y2="24">
          <stop offset="0%" stopColor="#E7D8B1" />
          <stop offset="100%" stopColor="#C6A25D" />
        </linearGradient>
      </defs>
      <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" stroke="url(#g2)" strokeWidth="1.6" />
      <path d="M9 11l2 2 4-4" stroke="url(#g2)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function GoldFeather({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="g3" x1="0" y1="0" x2="24" y2="24">
          <stop offset="0%" stopColor="#E7D8B1" />
          <stop offset="100%" stopColor="#C6A25D" />
        </linearGradient>
      </defs>
      <path d="M20 4c-6 0-12 6-12 12v4h4c6 0 12-6 12-12" stroke="url(#g3)" strokeWidth="1.6" />
      <path d="M8 16l8-8M10 18l8-8" stroke="url(#g3)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
