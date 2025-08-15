'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useWishlist } from '@/store/wishlist'
import { useCartStore } from '@/store/cart'
import { PRODUCTS as LOCAL_CATALOG } from '@/lib/catalog'

type Me = { loggedIn: boolean; name?: string; email?: string } | null
type Product = {
  id: string
  name: string
  image?: string
  price: number
  category?: string
  badge?: string
}

/* -------- helpers -------- */
function currency(n: number) {
  return `$${n.toLocaleString()}`
}

export default function AccountPage() {
  const router = useRouter()
  const [me, setMe] = useState<Me>(null)
  const [tab, setTab] = useState<'details' | 'orders' | 'wishlist'>('details')

  // wishlist ids from local store
  const idsSet = useWishlist((s) => s.ids)
  const wishIds = useMemo(() => Array.from(idsSet), [idsSet])
  const toggleWish = useWishlist((s) => s.toggle)
  const addToCartRaw = useCartStore((s: any) => s.addItem || s.add || s.addToCart)

  const addToCart = (p: Product) => {
    try {
      addToCartRaw({ id: p.id, name: p.name, price: p.price, image: p.image }, 1)
    } catch {
      try {
        addToCartRaw(p, 1)
      } catch {}
    }
  }

  /* -------- auth gate & me -------- */
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/me', { cache: 'no-store', credentials: 'include' })
        const data = await res.json()
        if (!mounted) return
        if (!data?.loggedIn) {
          router.replace(`/login?returnTo=/account`)
        } else {
          setMe(data)
        }
      } catch {
        router.replace(`/login?returnTo=/account`)
      }
    })()
    return () => { mounted = false }
  }, [router])

/* -------- wishlist products (exact resolution) -------- */
const [apiProducts, setApiProducts] = useState<Product[]>([])
const [loadingProducts, setLoadingProducts] = useState(false)

// Build lookup maps
const catalogMap = useMemo(() => {
  const m = new Map<string, Product>()
  for (const p of LOCAL_CATALOG) m.set(String(p.id), p as Product)
  return m
}, [])

const apiMap = useMemo(() => {
  const m = new Map<string, Product>()
  for (const p of apiProducts) m.set(String(p.id), p)
  return m
}, [apiProducts])

useEffect(() => {
  if (!wishIds.length) { setApiProducts([]); return }
  const ctrl = new AbortController()
  ;(async () => {
    try {
      setLoadingProducts(true)
      const res = await fetch('/api/products', { cache: 'no-store', signal: ctrl.signal })
      if (!res.ok) { setApiProducts([]); return }
      const data = await res.json()
      const normalized: Product[] = (data?.products || data || []).map((p: any, i: number) => ({
        id: String(p.id ?? p._id ?? `api-${i}`),
        name: p.name ?? 'Untitled',
        image: p.image ?? p.images?.[0] ?? '',
        price: Number(p.price ?? 0),
        category: String(p.category ?? ''),
        badge: p.badge,
      }))
      setApiProducts(normalized)
    } catch {
      setApiProducts([])
    } finally {
      setLoadingProducts(false)
    }
  })()
  return () => ctrl.abort()
}, [wishIds.join('|')])

// Prefer live API data; fall back to local catalog by id (so every id resolves)
const wishedProducts = useMemo(() => {
  return wishIds
    .map((rawId) => {
      const id = String(rawId)
      return apiMap.get(id) || catalogMap.get(id)
    })
    .filter(Boolean) as Product[]
}, [wishIds, apiMap, catalogMap])


  /* -------- UI -------- */
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#F9F5EE] to-white">
      {/* soft halos for a luxe feel */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-24 h-72 w-72 rounded-full blur-3xl bg-softgold/15" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full blur-3xl bg-champagne/20" />
      </div>

      {/* Hero */}
      <div className="container mx-auto px-4 pt-10 md:pt-14 relative">
        <div className="relative rounded-3xl overflow-hidden luxury-shadow">
        {/* Background image */}
        <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
            backgroundImage:
                "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1920&auto=format&fit=crop')",
            }}
        />

        {/* Gold-tinted gradient & vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1208]/50 via-[#0e0b07]/35 to-[#0b0907]/45" />
        <div className="absolute inset-0 [mask-image:radial-gradient(130%_90% at 50% 10%,black,transparent)]" />

        {/* Subtle top highlight */}
        <div className="absolute inset-x-0 -top-10 h-24 bg-white/10 blur-2xl" />

        {/* Content */}
        <div className="relative px-6 md:px-10 py-14 md:py-20">
            <p className="text-white/80 text-xs tracking-[0.3em] uppercase">Your space</p>
            <h1 className="mt-2 font-playfair text-3xl md:text-5xl text-white">
            {me?.name ? `Welcome, ${me.name}.` : 'Welcome back.'}
            </h1>
            <p className="mt-2 text-white/80">{me?.email}</p>
        </div>
        </div>


        {/* Tabs */}
        <div className="mt-6 md:mt-8 flex flex-wrap gap-2">
          <TabBtn active={tab === 'details'} onClick={() => setTab('details')}>Account details</TabBtn>
          <TabBtn active={tab === 'orders'} onClick={() => setTab('orders')}>Order history</TabBtn>
          <TabBtn active={tab === 'wishlist'} onClick={() => setTab('wishlist')}>Wishlisted items</TabBtn>
        </div>

        {/* Panels */}
        <div className="my-8">
          {tab === 'details' && (
            <div className="glass-card rounded-3xl p-6 md:p-8 luxury-shadow ring-1 ring-black/5">
              <h2 className="font-playfair text-2xl text-black">Account details</h2>
              <div className="mt-6 grid sm:grid-cols-2 gap-6">
                <Field label="Full name" value={me?.name || '—'} />
                <Field label="Email" value={me?.email || '—'} />
              </div>
              <div className="mt-8 flex items-center gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm hover:border-softgold hover:text-softgold transition"
                >
                  Continue shopping
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-4 py-2 text-sm hover:bg-black/90 transition"
                >
                  Explore products
                </Link>
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div className="glass-card rounded-3xl p-6 md:p-8 luxury-shadow ring-1 ring-black/5">
              <h2 className="font-playfair text-2xl text-black">Order history</h2>
              <EmptyState
                title="No orders yet"
                body="When you place an order, it will appear here with status and tracking."
                cta={{ href: '/products', label: 'Shop new arrivals' }}
              />
            </div>
          )}

          {tab === 'wishlist' && (
            <div className="glass-card rounded-3xl p-6 md:p-8 luxury-shadow ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                <h2 className="font-playfair text-2xl text-black">Wishlisted items</h2>
                <p className="text-sm text-gray-500">{wishIds.length} saved</p>
              </div>

              {!wishIds.length ? (
                <EmptyState
                  title="Your wishlist is waiting"
                  body="Save your favorite pieces to compare and revisit anytime."
                  cta={{ href: '/products', label: 'Find something you love' }}
                />
              ) : (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="group relative overflow-hidden rounded-2xl bg-white/70 ring-1 ring-black/5 shadow-sm hover:shadow-xl transition-all backdrop-blur"
                    >
                      <div className="relative aspect-[4/5]">
                        {p.image ? (
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gray-100" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                        <button
                          onClick={() => toggleWish(p.id)}
                          aria-label="Remove from wishlist"
                          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center ring-1 ring-black/10 hover:ring-softgold/40 transition"
                          title="Remove"
                        >
                          <svg className="h-5 w-5 text-softgold" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21s-6.5-4.2-9-7.7C1 10.8 2 7 5.5 6.4A5 5 0 0 1 12 9a5 5 0 0 1 6.5-2.6C22 7 23 10.8 21 13.3 18.5 16.8 12 21 12 21z" />
                          </svg>
                        </button>
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-medium text-black">{p.name}</h4>
                          <span className="text-softgold font-semibold">
                            {p.price ? currency(p.price) : '—'}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={() => addToCart(p)}
                            className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-3 py-2 text-sm hover:bg-black/90 transition"
                          >
                            Add to cart
                          </button>
                          <Link
                            href={`/products/${p.id}`}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm hover:border-softgold hover:text-softgold transition"
                          >
                            View details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {wishIds.length > 0 && loadingProducts && (
                <p className="mt-4 text-xs text-gray-500">Refreshing your saved items…</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ------- tiny UI bits ------- */
function TabBtn({
  active,
  onClick,
  children,
}: {
  active?: boolean
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'px-4 py-2 rounded-full text-sm transition ring-1',
        active
          ? 'bg-black text-white ring-black'
          : 'bg-white/80 text-gray-800 hover:text-black ring-black/10 hover:ring-black/20',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/80 ring-1 ring-black/5 p-4 backdrop-blur">
      <div className="text-xs uppercase tracking-widest text-gray-500">{label}</div>
      <div className="mt-1 text-black">{value}</div>
    </div>
  )
}

function EmptyState({
  title,
  body,
  cta,
}: {
  title: string
  body: string
  cta?: { href: string; label: string }
}) {
  return (
    <div className="mt-6 rounded-3xl bg-white/70 ring-1 ring-black/5 p-8 text-center backdrop-blur">
      <h3 className="font-playfair text-xl text-black">{title}</h3>
      <p className="mt-2 text-gray-600">{body}</p>
      {cta && (
        <Link
          href={cta.href}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-black text-white px-4 py-2 text-sm hover:bg-black/90 transition"
        >
          {cta.label}
        </Link>
      )}
    </div>
  )
}
