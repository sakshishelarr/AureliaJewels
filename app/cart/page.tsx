'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { PRODUCTS as LOCAL_CATALOG } from '@/lib/catalog'

type Product = {
  id: string
  name: string
  image?: string
  price: number
  category?: string
  badge?: string
}

const SNAPSHOT_KEY = 'aj-last-order' // success page reads this

const currency = (n: number) => `₹${n.toLocaleString('en-IN')}`

export default function CartPage() {
  const router = useRouter()

  // cart store
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const setQuantity = useCartStore((s) => s.setQuantity)

  // ---- Build catalog lookup once
  const catalogMap = useMemo(() => {
    const m = new Map<string, Product>()
    for (const p of LOCAL_CATALOG) m.set(p.id, p as unknown as Product)
    return m
  }, [])

  // ---- Optionally fetch live products to get latest name/price/image
  const [apiProducts, setApiProducts] = useState<Product[]>([])
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        const normalized: Product[] = (data?.products || data || []).map((p: any, i: number) => ({
          id: String(p.id ?? p._id ?? `api-${i}`),
          name: p.name ?? 'Untitled',
          image: p.image ?? p.images?.[0] ?? '',
          price: Number(p.price ?? 0),
          category: String(p.category ?? ''),
          badge: p.badge,
        }))
        if (!cancelled) setApiProducts(normalized)
      } catch {
        /* ignore – fall back to catalog */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const apiMap = useMemo(() => {
    const m = new Map<string, Product>()
    for (const p of apiProducts) m.set(p.id, p)
    return m
  }, [apiProducts])

  // ---- Enrich cart items by id (API → Catalog → Cart payload)
  const resolved = useMemo(() => {
    return items.map((it) => {
      const best = apiMap.get(it.id) || catalogMap.get(it.id)
      if (!best) return it // no enrichment found, use raw
      return {
        ...it,
        name: best.name ?? it.name,
        image: best.image || it.image,
        price: typeof best.price === 'number' && best.price > 0 ? best.price : it.price,
      }
    })
  }, [items, apiMap, catalogMap])

  const subtotal = useMemo(
    () => resolved.reduce((sum, it) => sum + (Number(it.price || 0) * Number(it.qty || 0)), 0),
    [resolved]
  )

  // ---- Checkout: snapshot enriched items, then navigate
  const goToCheckout = () => {
    try {
      sessionStorage.setItem(SNAPSHOT_KEY, JSON.stringify(resolved))
    } catch {}
    router.push('/order/success')
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <h1 className="font-playfair text-4xl text-black">Shopping Cart</h1>

      {resolved.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-white/70 ring-1 ring-black/5 p-10 text-center text-gray-600">
          Your cart is empty.{' '}
          <Link href="/products" className="underline underline-offset-2 hover:text-softgold">
            Continue shopping
          </Link>
          .
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-6">
            {resolved.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-white/80 ring-1 ring-black/5 p-4 sm:p-5 flex gap-4 items-start"
              >
                <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : null}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-black truncate">{item.name}</h3>
                  <div className="mt-1 text-softgold font-semibold">
                    {typeof item.price === 'number' && item.price > 0 ? currency(item.price) : '—'}
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <QuantityControl
                      quantity={item.qty}
                      onChange={(q) => setQuantity(item.id, q)}
                      min={1}
                    />
                    <button
                      className="text-red-500 text-sm hover:underline"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <aside className="rounded-2xl bg-white/80 ring-1 ring-black/5 p-6 h-fit">
            <h2 className="text-lg font-semibold text-black">Order Summary</h2>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-gray-600">
                Subtotal ({resolved.reduce((n, i) => n + i.qty, 0)} items)
              </span>
              <span className="font-semibold text-black">{currency(subtotal)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-700">Free</span>
            </div>
            <div className="mt-4 border-t border-gray-200 pt-4 flex items-center justify-between">
              <span className="text-black font-semibold">Total</span>
              <span className="text-black font-semibold">{currency(subtotal)}</span>
            </div>

            {/* Single button (no Link wrapper) */}
            <button
              onClick={goToCheckout}
              className="mt-6 w-full rounded-xl bg-[#c8a96a] text-white px-4 py-3 font-semibold hover:opacity-90 transition"
            >
              Proceed to Checkout
            </button>

            <p className="mt-3 text-xs text-gray-500">
              Secure checkout powered by industry-leading encryption
            </p>
          </aside>
        </div>
      )}
    </section>
  )
}

/* -------------- small quantity input -------------- */
function QuantityControl({
  quantity,
  onChange,
  min = 1,
}: {
  quantity: number
  onChange: (q: number) => void
  min?: number
}) {
  const dec = () => onChange(Math.max(min, quantity - 1))
  const inc = () => onChange(quantity + 1)

  return (
    <div className="inline-flex items-center rounded-xl border border-gray-200 overflow-hidden">
      <button onClick={dec} className="px-3 py-2 text-gray-700 hover:bg-gray-50">−</button>
      <div className="px-4 py-2 select-none">{quantity}</div>
      <button onClick={inc} className="px-3 py-2 text-gray-700 hover:bg-gray-50">+</button>
    </div>
  )
}
