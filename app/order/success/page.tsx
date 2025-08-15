'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import successImg from '@/images/success.avif'


type OrderedItem = {
  id: string
  name: string
  image?: string
  price: number
  qty: number
}

const SNAPSHOT_KEY = 'aj-last-order'
const currency = (n: number) => `₹${n.toLocaleString('en-IN')}`

export default function OrderSuccessPage() {
  const [items, setItems] = useState<OrderedItem[]>([])
  const [me, setMe] = useState<{ name?: string; email?: string } | null>(null)
  const clearCart = useCartStore((s) => s.clearCart)

  // Read the cart snapshot saved by the Cart page, then clear the live cart
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SNAPSHOT_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Array<any>
        // normalize to the shape we expect
        const normalized: OrderedItem[] = parsed.map((i) => ({
          id: String(i.id),
          name: String(i.name ?? 'Item'),
          image: i.image || '',
          price: Number(i.price ?? 0),
          qty: Number(i.qty ?? 1),
        }))
        setItems(normalized)
        // remove snapshot so refresh shows empty confirmation
        sessionStorage.removeItem(SNAPSHOT_KEY)
      }
    } catch {
      /* ignore */
    }
    // clear the live cart now that the order is placed
    try {
      clearCart()
    } catch {}
  }, [clearCart])

  // (Nice-to-have) fetch user name/email to greet them
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/me', { cache: 'no-store', credentials: 'include' })
        const data = await res.json()
        if (data?.loggedIn) setMe({ name: data.name, email: data.email })
      } catch {}
    })()
  }, [])

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
    [items]
  )

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#F9F5EE] to-white">
      {/* Luxe hero */}
      <div className="container mx-auto px-4 pt-10 md:pt-14 relative">
        {/* LUXE HERO — start */}
            <div className="relative overflow-hidden rounded-[32px] luxury-shadow">
            {/* Background image */}
            <div className="absolute inset-0">
                <img
                src={successImg.src}
                alt="Order success jewellery background"
                className="h-full w-full object-cover scale-[1.04] brightness-95"
                fetchPriority="high"
                />
                {/* Rich vignette + gold wash */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#CFA65C1A] via-transparent to-transparent" />
                {/* Ambient light blooms */}
                <div className="pointer-events-none absolute -inset-x-40 -top-32 h-56 bg-white/15 blur-3xl" />
                <div className="pointer-events-none absolute -right-28 -bottom-28 h-80 w-80 rounded-full bg-gradient-to-tr from-[#E6C37B66] to-transparent blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative px-6 md:px-12 py-14 md:py-20">
                <p className="text-white/75 text-[11px] tracking-[0.32em] uppercase">Order confirmed</p>

                <h1
                className="mt-2 font-playfair text-3xl md:text-5xl leading-tight
                            bg-gradient-to-r from-[#F7E7B7] via-[#FFD98A] to-[#E4BE72]
                            bg-clip-text text-transparent drop-shadow-[0_1px_0_rgba(0,0,0,.3)]"
                >
                Congratulations{me?.name ? `, ${me.name}` : ''}! 
                </h1>

                <p className="mt-2 text-white/85">
                Your order has been placed successfully
                {me?.email ? <>. A confirmation has been sent to <span className="font-medium">{me.email}</span>.</> : '.'}
                </p>

                {/* Chips */}
                <div className="mt-6 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/20 px-4 py-2 text-white/90 backdrop-blur">
                    <span className="text-xs uppercase tracking-[0.24em]">Estimated delivery</span>
                    <span className="rounded-full bg-white/90 text-black text-sm px-3 py-1">3–5 business days</span>
                </div>
                {/* Optional: order number if you want to show one */}
                {/* <span className="rounded-full bg-white/10 ring-1 ring-white/20 px-4 py-2 text-white/90 backdrop-blur text-sm">
                    Order&nbsp;#AJ76399913
                </span> */}
                </div>
            </div>
            </div>
            {/* LUXE HERO — end */}


        {/* Body */}
        <div className="my-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="glass-card rounded-3xl p-6 md:p-8 luxury-shadow ring-1 ring-black/5 lg:col-span-2">
            <h2 className="font-playfair text-2xl text-black">Your items</h2>

            {items.length === 0 ? (
              <p className="mt-6 text-gray-600">No items found for this order.</p>
            ) : (
              <ul className="mt-6 space-y-5">
                {items.map((it) => (
                  <li key={it.id} className="flex items-start gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      {it.image ? (
                        <Image src={it.image} alt={it.name} fill sizes="80px" className="object-cover" />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-medium text-black truncate">{it.name}</p>
                        <span className="text-softgold font-semibold">{currency(it.price)}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">Qty: {it.qty}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Summary */}
          <aside className="rounded-3xl bg-white/80 ring-1 ring-black/5 p-6 h-fit">
            <h2 className="text-lg font-semibold text-black">Order summary</h2>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-gray-600">Subtotal</span>
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

            <Link
              href="/products"
              className="mt-6 block text-center rounded-xl bg-black text-white px-4 py-3 font-semibold hover:bg-black/90 transition"
            >
              Continue shopping
            </Link>
            <Link
              href="/account"
              className="mt-3 block text-center rounded-xl border border-gray-200 px-4 py-3 font-semibold hover:border-softgold hover:text-softgold transition"
            >
              View account
            </Link>

            <p className="mt-4 text-xs text-gray-500">
              Need help? Our concierge team will reach out shortly with next steps.
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}
