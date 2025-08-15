interface QuantityControlProps {
  quantity: number
  onChange: (quantity: number) => void
  min?: number
  max?: number
}

export default function QuantityControl({ 
  quantity, 
  onChange, 
  min = 1, 
  max = 99 
}: QuantityControlProps) {
  const decrease = () => {
    if (quantity > min) {
      onChange(quantity - 1)
    }
  }

  const increase = () => {
    if (quantity < max) {
      onChange(quantity + 1)
    }
  }

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium">Quantity:</span>
      <div className="flex items-center border border-gray-200 rounded-lg">
        <button
          onClick={decrease}
          disabled={quantity <= min}
          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          −
        </button>
        <span className="px-4 py-2 min-w-12 text-center">{quantity}</span>
        <button
          onClick={increase}
          disabled={quantity >= max}
          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>
    </div>
  )
}