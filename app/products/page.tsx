'use client'

import { useMemo, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { PRODUCTS } from '@/lib/catalog'

type Category = 'necklaces' | 'earrings' | 'rings' | 'bracelets'

type Product = {
  id: string
  name: string
  category: Category | string
  price: number
  image: string
  badge?: 'New' | 'Limited' | 'Bestseller'
}

/* =======================
   FALLBACK CATALOG (yours)
   ======================= */
/*const PRODUCTS: Product[] = [
  // ---- NECKLACES ----
  { id: 'n1', name: 'Celeste Étoile Necklace', category: 'necklaces', price: 1699, image:'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1600&auto=format&fit=crop', badge: 'Bestseller' },
  { id: 'n2', name: 'Aurora Tennis Necklace', category: 'necklaces', price: 2990, image:'https://images.unsplash.com/photo-1616406432301-9f04b537f178?q=80&w=1600&auto=format&fit=crop' },
  { id: 'n3', name: 'Lumière Pearl Collar', category: 'necklaces', price: 2140, image:'https://images.unsplash.com/photo-1520972270160-7da4b438ee2b?q=80&w=1600&auto=format&fit=crop', badge: 'Limited' },
  { id: 'n4', name: 'Seraphine Halo Pendant', category: 'necklaces', price: 1290, image:'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1600&auto=format&fit=crop' },
  // ---- EARRINGS ----
  { id: 'e1', name: 'Opaline Drop Earrings', category: 'earrings', price: 840, image:'https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1600&auto=format&fit=crop', badge: 'New' },
  { id: 'e2', name: 'Solstice Diamond Hoops', category: 'earrings', price: 1460, image:'https://images.unsplash.com/photo-1603575449153-8e3882f44381?q=80&w=1600&auto=format&fit=crop' },
  { id: 'e3', name: 'Éclat Pearl Studs', category: 'earrings', price: 690, image:'https://images.unsplash.com/photo-1581287053822-3e8d289c5e56?q=80&w=1600&auto=format&fit=crop' },
  // ---- RINGS ----
  { id: 'r1', name: 'Ethereal Halo Ring', category: 'rings', price: 1890, image:'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1600&auto=format&fit=crop', badge: 'Bestseller' },
  { id: 'r2', name: 'Sapphire Enchant Ring', category: 'rings', price: 2350, image:'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop' },
  { id: 'r3', name: 'Nocturne Pavé Band', category: 'rings', price: 980, image:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1600&auto=format&fit=crop', badge: 'Limited' },
  // ---- BRACELETS ----
  { id: 'b1', name: 'Aurora Line Bracelet', category: 'bracelets', price: 1640, image:'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1600&auto=format&fit=crop' },
  { id: 'b2', name: 'Gilded Curb Chain', category: 'bracelets', price: 1120, image:'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1600&auto=format&fit=crop', badge: 'New' },
  { id: 'b3', name: 'Étoile Tennis Bracelet', category: 'bracelets', price: 2490, image:'https://images.unsplash.com/photo-1602526217744-88c1f3e07774?q=80&w=1600&auto=format&fit=crop' },
]
*/

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'necklaces', label: 'Necklaces' },
  { key: 'earrings', label: 'Earrings' },
  { key: 'rings', label: 'Rings' },
  { key: 'bracelets', label: 'Bracelets' },
]

function useDebounced<T>(val: T, delay = 250) {
  const [v, setV] = useState(val)
  useEffect(() => {
    const t = setTimeout(() => setV(val), delay)
    return () => clearTimeout(t)
  }, [val, delay])
  return v
}

export default function ProductsPage() {
  // 🔐 LOGIN STATE (add this block)
  const [loggedIn, setLoggedIn] = useState(false)
  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.json())
      .then((d) => setLoggedIn(!!d.loggedIn))
      .catch(() => setLoggedIn(false))
  }, [])
  const requireLogin = (ok: () => void) => {
    if (!loggedIn) {
      const url = new URL(window.location.href)
      window.location.href = `/login?returnTo=${encodeURIComponent(
        url.pathname + url.search
      )}`
      return
    }
    ok()
  }
  // --------------------------------------

  // filters
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounced(query)
  const [selected, setSelected] = useState<Set<Category>>(new Set())
  const [maxPrice, setMaxPrice] = useState(3000)

  // sorting
  const [sort, setSort] = useState<'lh' | 'hl' | 'new'>('new')

  // data
  const [apiProducts, setApiProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // fetch from your API; merge with fallback
  useEffect(() => {
    const ctrl = new AbortController()
    async function run() {
      try {
        setLoading(true)
        setError(null)
        const params = new URLSearchParams()
        if (debouncedQuery) params.set('q', debouncedQuery)
        if (selected.size) params.set('category', Array.from(selected).join(','))
        if (maxPrice) params.set('maxPrice', String(maxPrice))
        if (sort) params.set('sort', sort)
        const res = await fetch(`/api/products?${params.toString()}`, {
          signal: ctrl.signal,
          cache: 'no-store',
        })
        if (!res.ok) throw new Error(`API ${res.status}`)
        const data = await res.json()
        const normalized: Product[] = (data?.products || data || []).map((p: any, idx: number) => ({
          id: String(p.id ?? p._id ?? `api-${idx}`),
          name: p.name ?? 'Untitled',
          category: String(p.category ?? 'necklaces').toLowerCase(),
          price: Number(p.price ?? 0),
          image: p.image ?? p.images?.[0] ?? '',
          badge: p.badge,
        }))
        setApiProducts(normalized)
      } catch (e) {
        console.warn('Products API unavailable, using fallback.', e)
        setError('Showing curated selection while we refresh availability.')
        setApiProducts([])
      } finally {
        setLoading(false)
      }
    }
    run()
    return () => ctrl.abort()
  }, [debouncedQuery, Array.from(selected).join('|'), maxPrice, sort])

  // merge (no reduction of your list)
  const merged: Product[] = useMemo(() => {
    const byId = new Map<string, Product>()
    PRODUCTS.forEach((p) => byId.set(p.id, p))
    apiProducts.forEach((p) => byId.set(p.id, p))
    return Array.from(byId.values())
  }, [apiProducts])

  // derived (client-side refine)
  const results = useMemo(() => {
    let list = merged.filter((p) => p.price <= maxPrice)

    if (selected.size) list = list.filter((p) => selected.has(p.category as Category))

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          String(p.category).toLowerCase().includes(q),
      )
    }

    if (sort === 'lh') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'hl') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'new') list = [...list].sort((a, b) => (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0))

    return list
  }, [debouncedQuery, selected, maxPrice, sort, merged])

  const toggleCategory = (cat: Category) => {
    const next = new Set(selected)
    next.has(cat) ? next.delete(cat) : next.add(cat)
    setSelected(next)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#F9F5EE] to-white">
      {/* halos */}
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl bg-softgold/15" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full blur-3xl bg-champagne/20" />
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 relative">
        {/* Header */}
        <header className="mb-8">
          <p className="tracking-[.25em] text-[12px] text-gray-500 uppercase">
            Curated selection
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <h1 className="font-playfair text-3xl md:text-5xl text-black">
              Discover luxury pieces.
            </h1>

            {/* Sort control */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Sort by</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-softgold"
              >
                <option value="new">Featured / New</option>
                <option value="lh">Price: Low → High</option>
                <option value="hl">Price: High → Low</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mt-3 rounded-xl bg-amber-50 text-amber-800 text-xs px-3 py-2 ring-1 ring-amber-200 inline-block">
              {error}
            </div>
          )}
        </header>

        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div className="rounded-2xl bg-white/80 ring-1 ring-black/5 backdrop-blur p-3 shadow-sm">
                <label className="text-xs uppercase tracking-widest text-gray-500">
                  Search
                </label>
                <div className="mt-2 flex items-center rounded-xl border border-gray-200 bg-white px-3">
                  <svg className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
                  </svg>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products"
                    className="ml-2 w-full py-2 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Category filter */}
              <div className="rounded-2xl bg-white/80 ring-1 ring-black/5 backdrop-blur p-4 shadow-sm">
                <h3 className="font-semibold text-sm">Category</h3>
                <ul className="mt-3 space-y-2">
                  {CATEGORIES.map((c) => (
                    <li key={c.key} className="flex items-center justify-between">
                      <button
                        onClick={() => toggleCategory(c.key)}
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-black"
                      >
                        <span
                          className={[
                            'h-4 w-4 rounded border',
                            selected.has(c.key) ? 'bg-softgold border-softgold' : 'border-gray-300',
                          ].join(' ')}
                        />
                        {c.label}
                      </button>
                      <span className="text-xs text-gray-400">
                        {merged.filter((p) => String(p.category) === c.key).length}
                      </span>
                    </li>
                  ))}
                </ul>

                {selected.size > 0 && (
                  <button
                    onClick={() => setSelected(new Set())}
                    className="mt-3 text-xs text-gray-500 underline underline-offset-2"
                  >
                    Clear categories
                  </button>
                )}
              </div>

              {/* Price range */}
              <div className="rounded-2xl bg-white/80 ring-1 ring-black/5 backdrop-blur p-4 shadow-sm">
                <h3 className="font-semibold text-sm">Price (max)</h3>
                <div className="mt-3">
                  <input
                    type="range"
                    min={300}
                    max={3000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full accent-softgold"
                  />
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span>$300</span>
                    <span className="text-black font-medium">${maxPrice}</span>
                    <span>$3000</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <main className="col-span-12 md:col-span-9">
            {loading ? (
              <SkeletonGrid />
            ) : results.length === 0 ? (
              <div className="rounded-2xl bg-white/70 ring-1 ring-black/5 p-10 text-center text-gray-600">
                No products match your filters. Try widening your price range or
                clearing categories.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((p) => (
                  <ProductCard key={p.id} product={p} requireLogin={requireLogin} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  )
}

/* ----------------- Card (with Quick Add & Wishlist) ----------------- */

function ProductCard({
  product,
  requireLogin, // 🔐 added
}: {
  product: Product
  requireLogin: (ok: () => void) => void
}) {
  // cart — try common signatures so it "just works"
  const addRaw = useCartStore((s: any) => s.add || s.addItem || s.addToCart)

  const addToCartUnprotected = (p: Product) => {
    try {
      addRaw(p, 1) // prefer (product, qty)
    } catch {
      try {
        addRaw({ id: p.id, name: p.name, price: p.price, image: p.image, qty: 1 })
      } catch {
        console.warn('Expose add(product, qty) or addItem(product) in cart store.')
      }
    }
  }

  // wishlist
  const has = useWishlist((s) => s.has(product.id))
  const toggle = useWishlist((s) => s.toggle)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/70 ring-1 ring-black/5 shadow-sm hover:shadow-xl transition-all backdrop-blur">
      <div className="relative aspect-[4/5]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        {product.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] tracking-wide">
            {product.badge}
          </span>
        )}

        {/* wishlist heart (🔐 gate) */}
        {mounted ? (
        <button
          onClick={() => requireLogin(() => toggle(product.id))}
          aria-label="Wishlist"
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center ring-1 ring-black/10 hover:ring-softgold/40 transition"
        >
          <svg
            suppressHydrationWarning
            className={['h-5 w-5 transition', has ? 'text-softgold' : 'text-gray-700'].join(' ')}
            viewBox="0 0 24 24"
            fill={has ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M12 21s-6.5-4.2-9-7.7C1 10.8 2 7 5.5 6.4A5 5 0 0 1 12 9a5 5 0 0 1 6.5-2.6C22 7 23 10.8 21 13.3 18.5 16.8 12 21 12 21z" />
          </svg>
        </button>
          ) : (
          // keep layout stable while hydrating
          <span className="absolute top-3 right-3 h-9 w-9 rounded-full" />
        )}

        {/* hover shine */}
        <div className="pointer-events-none absolute -inset-[40%] rotate-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute left-1/2 top-0 h-[140%] w-[30%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent blur-xl" />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-medium text-black">{product.name}</h4>
          <span className="text-softgold font-semibold">${product.price}</span>
        </div>
        <p className="mt-1 text-xs text-gray-500 capitalize">
          {product.category}
        </p>

        <div className="mt-3 flex items-center gap-2">
          {/* Quick add (🔐 gate) */}
          <button
            onClick={() => requireLogin(() => addToCartUnprotected(product))}
            className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-3 py-2 text-sm hover:bg-black/90 transition"
          >
            Quick add
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
            </svg>
          </button>

          <Link
            href={`/products/${product.id}`}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm hover:border-softgold hover:text-softgold transition"
          >
            Details
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ----------------- Skeleton ----------------- */

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl bg-white/70 ring-1 ring-black/5">
          <div className="aspect-[4/5] animate-pulse bg-gray-200/60" />
          <div className="p-4 space-y-2">
            <div className="h-4 w-2/3 bg-gray-200/60 rounded animate-pulse" />
            <div className="h-3 w-1/3 bg-gray-200/60 rounded animate-pulse" />
            <div className="mt-3 h-9 w-1/2 bg-gray-200/60 rounded-xl animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}
