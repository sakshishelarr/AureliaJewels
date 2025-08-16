'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'

import LiveDemoModal from './LiveDemoModal'

// SVGR icons
import CartIcon from '@/images/cart.svg'
import ProfileIcon from '@/images/profile.svg'
import DemoIcon from '@/images/demo.svg'

type UserState = { loggedIn: boolean; email?: string; name?: string } | null

export default function Navbar() { 
  const [user, setUser] = useState<UserState>(null)
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  // cart badge (guard hydration)
  const totalItems = useCartStore((s: any) =>
    mounted ? s.items.reduce((sum: number, i: any) => sum + i.qty, 0) : 0
  )

  // ——— auth fetch helper (no-store + credentials) ———
  async function loadMe() {
    try {
      const res = await fetch('/api/me', {
        cache: 'no-store',
        credentials: 'include',
      })
      const data = await res.json()
      setUser(data)
    } catch {
      setUser({ loggedIn: false })
    }
  }

  useEffect(() => {
    setMounted(true)
    loadMe()
  }, [])

  // refetch when tab becomes visible (after navigation or refresh)
  useEffect(() => {
    const onVis = () => document.visibilityState === 'visible' && loadMe()
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])
    // LIVE AUTH BRIDGE: update navbar immediately after a successful login
  useEffect(() => {
    function onAuthLogin(e: Event) {
      // CustomEvent<{email?: string; name?: string}>
      const detail = (e as CustomEvent).detail || {}
      setUser({ loggedIn: true, email: detail.email, name: detail.name })
      setMenuOpen(false)
      // optional: soft refresh so /api/me is in sync, but UI already updated
      // router.refresh()
    }

    function onStorage(ev: StorageEvent) {
      // fired when other tabs write the ping; also fires in same tab in most browsers
      if (ev.key === 'aj-auth-ping') {
        loadMe() // re-check /api/me and update navbar
      }
    }

    window.addEventListener('aurelia:auth:login', onAuthLogin as EventListener)
    window.addEventListener('storage', onStorage)

    return () => {
      window.removeEventListener('aurelia:auth:login', onAuthLogin as EventListener)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  // Close profile menu on outside click / ESC
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('click', onClick)
    window.addEventListener('keydown', onEsc)
    return () => {
      window.removeEventListener('click', onClick)
      window.removeEventListener('keydown', onEsc)
    }
  }, [])

  // Shadow + denser bg when scrolling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST', cache: 'no-store', credentials: 'include' })
    } finally {
      // tell stores to clear immediately
      window.dispatchEvent(new Event('aurelia:auth:logout'))
      // belt & suspenders – nuke persisted keys if any remain
      try { localStorage.removeItem('aj-cart-v1') } catch {}
      try { localStorage.removeItem('aj-wishlist-v1') } catch {}

      setUser({ loggedIn: false })
      setMenuOpen(false)
      router.refresh()
    }
  }

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const active = pathname === href
    return (
      <Link
        href={href}
        className={[
          'relative text-[15px] transition-colors',
          active ? 'text-black' : 'text-gray-700 hover:text-softgold',
        ].join(' ')}
      >
        {label}
        <span
          className={[
            'absolute left-1/2 -bottom-1 h-[2px] w-0 -translate-x-1/2 rounded-full bg-softgold transition-all duration-300',
            active ? 'w-6' : 'group-hover:w-6',
          ].join(' ')}
        />
      </Link>
    )
  }
const [showDemo, setShowDemo] = useState(false) //regarding live demo modal

  return (
    <>
    <nav
      className={[
        'fixed top-0 left-0 right-0 z-50',
        'border-b border-black/5',
        'backdrop-blur-md supports-[backdrop-filter]:bg-white/60',
        scrolled ? 'bg-white/85 shadow-[0_6px_24px_rgba(12,12,13,0.06)]' : 'bg-white/70',
      ].join(' ')}
    >
      <div className="h-[2px] bg-gradient-to-r from-transparent via-softgold/70 to-transparent" />

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="font-playfair text-[20px] tracking-wide text-black" aria-label="Aurelia Jewels – home">
            AURELIA JEWELS
          </Link>

          <div className="hidden md:flex items-center gap-8 group">
            <NavLink href="/" label="Home" />
            <NavLink href="/about" label="About" />
            <NavLink href="/products" label="Products" />
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Live Demo Button */}
            <button
              onClick={() => setShowDemo(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-black/5 hover:ring-softgold/40 transition text-black hover:text-softgold"
              title="Live Demo"
            >
              <DemoIcon className="h-5 w-5" />
            </button>
            <Link
              href="/cart"
              aria-label="Cart"
              prefetch={false}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-black/5 hover:ring-softgold/40 transition text-black hover:text-softgold"
              title="Cart"
            >
            
              <CartIcon className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] rounded-full bg-softgold px-1.5 text-[11px] leading-5 text-white text-center">
                  {totalItems}
                </span>
              )}
            </Link>
            


            <div className="relative" ref={menuRef}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-black/5 hover:ring-softgold/40 transition text-black hover:text-softgold"
                title="Account"
              >
                <ProfileIcon className="h-5 w-5" />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl bg-white/95 backdrop-blur shadow-xl ring-1 ring-black/5"
                >
                  {user?.loggedIn ? (
                    <div className="py-2">
                      <div className="px-4 py-2 text-xs text-gray-500">
                        Hi, <span className="font-medium text-black">{user?.name || user?.email?.split('@')[0]}</span>
                      </div>
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                        role="menuitem"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="py-2">
                      <Link
                        href="/login"
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/login?mode=signup"
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                      >
                        Create account
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
    </nav>
    {showDemo && <LiveDemoModal onClose={() => setShowDemo(false)} />}
    </>
  )
}
