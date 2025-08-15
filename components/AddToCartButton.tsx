'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import QuantityControl from './QuantityControl';
import AuthGateHint from './AuthGateHint';

interface Product {
  id: string
  slug: string
  name: string
  price: number
  image: string
}

interface AddToCartButtonProps {
  product: Product
  disabled?: boolean
}

export default function AddToCartButton({ product, disabled = false }: AddToCartButtonProps) {
  const [user, setUser] = useState<{ loggedIn: boolean } | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [showAuthHint, setShowAuthHint] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const router = useRouter()
  const addItem = useCartStore(state => state.addItem)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/me')
      const data = await res.json()
      setUser(data)
    } catch (error) {
      setUser({ loggedIn: false })
    }
  }

  const handleAddToCart = async () => {
    if (!user?.loggedIn) {
      setShowAuthHint(true)
      setTimeout(() => setShowAuthHint(false), 3000)
      return
    }

    setIsAdding(true)
    addItem(product, quantity)
    
    // Show success feedback
    setTimeout(() => {
      setIsAdding(false)
    }, 500)
  }

  const handleLoginRedirect = () => {
    router.push(`/login?returnTo=/products/${product.slug}`)
  }

  return (
    <div className="space-y-4">
      <QuantityControl
        quantity={quantity}
        onChange={setQuantity}
        min={1}
        max={10}
      />

      <div className="space-y-3">
        <button
          onClick={handleAddToCart}
          disabled={disabled || isAdding}
          className={`w-full py-3 rounded-xl font-semibold transition-colors ${
            disabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-softgold text-white hover:bg-softgold/90'
          }`}
        >
          {isAdding ? 'Adding...' : disabled ? 'Out of Stock' : 'Add to Cart'}
        </button>

        {!user?.loggedIn && (
          <button
            onClick={handleLoginRedirect}
            className="w-full py-2 text-softgold border border-softgold rounded-xl hover:bg-softgold hover:text-white transition-colors text-sm"
          >
            Login to Purchase
          </button>
        )}
      </div>

      {showAuthHint && <AuthGateHint />}
    </div>
  )
}