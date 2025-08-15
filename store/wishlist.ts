import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type WishlistState = {
  ids: Set<string>
  toggle: (id: string) => void
  has: (id: string) => boolean
  clear: () => void
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: new Set<string>(),
      toggle: (id) => {
        const next = new Set(get().ids)
        next.has(id) ? next.delete(id) : next.add(id)
        set({ ids: next })
      },
      has: (id) => get().ids.has(id),
      clear: () => set({ ids: new Set() }),
    }),
    {
      name: 'aj-wishlist-v1',
      partialize: (s) => ({ ids: Array.from(s.ids) }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const anyState = state as any
          if (Array.isArray(anyState.ids)) anyState.ids = new Set(anyState.ids)
        }
      },
    }
  )
)

if (typeof window !== 'undefined') {
  window.addEventListener('aurelia:auth:logout', () => {
    try { localStorage.removeItem('aj-wishlist-v1') } catch {}
    useWishlist.getState().clear()
  })
}
