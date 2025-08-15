import Image from 'next/image'
import Link from 'next/link'
import Price from './Price'

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

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link 
      href={`/products/${product.slug}`}
      className="group bg-white rounded-2xl overflow-hidden luxury-shadow hover:scale-105 transition-transform"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-black px-3 py-1 rounded-full text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}
        
        {product.tags?.includes('bestseller') && (
          <div className="absolute top-3 left-3">
            <span className="bg-softgold text-white px-2 py-1 rounded-full text-xs font-medium">
              Bestseller
            </span>
          </div>
        )}
        
        {product.tags?.includes('new') && (
          <div className="absolute top-3 right-3">
            <span className="bg-emerald text-white px-2 py-1 rounded-full text-xs font-medium">
              New
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-softgold transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.shortDescription}
        </p>
        <Price amount={product.price} className="text-lg font-semibold text-softgold" />
      </div>
    </Link>
  )
}