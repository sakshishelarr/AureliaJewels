import { create } from 'zustand'
import { persist } from 'zustand/middleware'


// a tiny inline placeholder that always works with next/image
export const CART_IMG_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500"><rect width="100%" height="100%" fill="#f2f2f2"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#bbb" font-family="sans-serif" font-size="18">No image</text></svg>`
  )
  
type CartItem = { id: string; name: string; price: number; image?: string; qty: number }

interface CartStore {
  items: CartItem[]
  addItem: (product: Omit<CartItem, 'qty'>, quantity: number) => void
  removeItem: (id: string) => void
  setQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  subtotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity) => {
        set((state) => {
          const existing = state.items.find(i => i.id === product.id)
          if (existing) {
            return { items: state.items.map(i => i.id === product.id ? { ...i, qty: i.qty + quantity } : i) }
          }
          return { items: [...state.items, { ...product, qty: quantity }] }
        })
      },

      removeItem: (id) => set((s) => ({ items: s.items.filter(i => i.id !== id) })),

      setQuantity: (id, quantity) => {
        if (quantity <= 0) return get().removeItem(id)
        set((s) => ({ items: s.items.map(i => i.id === id ? { ...i, qty: quantity } : i) }))
      },

      clearCart: () => set({ items: [] }),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    {
      name: 'aj-cart-v1',
    }
  )
)

// Clear immediately when the app broadcasts a logout
if (typeof window !== 'undefined') {
  window.addEventListener('aurelia:auth:logout', () => {
    try { localStorage.removeItem('aj-cart-v1') } catch {}
    useCartStore.getState().clearCart()
  })
}
