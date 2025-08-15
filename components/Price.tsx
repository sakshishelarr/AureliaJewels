interface PriceProps {
  amount: number
  className?: string
}

export default function Price({ amount, className = '' }: PriceProps) {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount)

  return <span className={className}>{formatted}</span>
}