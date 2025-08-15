import ProductCard from './ProductCard'
import EmptyState from './EmptyState'

interface Product {
  _id: string
  name: string
  slug: string
  shortDescription: string
  price: number
  images: string[]
  category: string
  inStock: boolean
  tags?: string[]
}

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="Try adjusting your search criteria or browse all products"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}