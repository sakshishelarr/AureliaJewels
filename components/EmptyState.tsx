interface EmptyStateProps {
  title: string
  description: string
  action?: React.ReactNode
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">💎</div>
      <h3 className="font-playfair text-2xl font-semibold text-black mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6">
        {description}
      </p>
      {action}
    </div>
  )
}