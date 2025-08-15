import { notFound } from 'next/navigation'
import Image from 'next/image'
import ProductGallery from '@/components/ProductGallery'
import AddToCartButton from '@/components/AddToCartButton'
import Price from '@/components/Price'
import ProductGrid from '@/components/ProductGrid'

async function getProduct(slug: string) {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'
    
    const res = await fetch(`${baseUrl}/api/products/${slug}`, {
      //cache: 'revalidate',
      next: { revalidate: 300 }
    })
    
    if (!res.ok) return null
    return await res.json()
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

async function getRelatedProducts(category: string, currentSlug: string) {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'
    
    const res = await fetch(`${baseUrl}/api/products?category=${category}&limit=4`, {
      //cache: 'revalidate',
      next: { revalidate: 300 }
    })
    
    if (!res.ok) return { products: [] }
    const data = await res.json()
    
    // Filter out current product
    const related = data.products.filter((p: any) => p.slug !== currentSlug)
    return { products: related }
  } catch (error) {
    console.error('Error fetching related products:', error)
    return { products: [] }
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)
  
  if (!product) {
    return {
      title: 'Product Not Found - Aurelia Jewels'
    }
  }

  return {
    title: `${product.name} - Aurelia Jewels`,
    description: product.shortDescription,
    keywords: `${product.name}, ${product.category}, luxury jewelry, ${product.tags?.join(', ')}`
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)
  
  if (!product) {
    notFound()
  }

  const { products: relatedProducts } = await getRelatedProducts(product.category, product.slug)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Product Gallery */}
        <div>
          <ProductGallery images={product.images} alt={product.name} />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="font-playfair text-3xl lg:text-4xl font-semibold text-black mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600 text-lg">
              {product.shortDescription}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Price amount={product.price} className="text-2xl font-semibold" />
            {product.inStock ? (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                In Stock
              </span>
            ) : (
              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="flex gap-2">
              {product.tags.map((tag: string) => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-champagne text-black text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="border-t pt-6">
            <AddToCartButton 
              product={{
                id: product._id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.images[0]
              }}
              disabled={!product.inStock}
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="font-playfair text-3xl font-semibold text-black mb-8">
            Related Products
          </h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  )
}