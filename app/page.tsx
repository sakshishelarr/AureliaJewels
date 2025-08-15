import Hero from '@/components/Hero'
import ShowcaseCarousel from '@/components/ShowcaseCarousel'
import CategoryStrip from '@/components/CategoryShowcase'
import SignatureShowcase from '@/components/SignatureShowcase'
import PerksAndSignup from '@/components/PerksAndSignup'
import LuxePerksRow from '@/components/LuxePerksRow'
import ProductGrid from '@/components/ProductGrid'
import ScrollTop from '@/components/ScrollTop'


async function getFeaturedProducts() {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'
    
    const res = await fetch(`${baseUrl}/api/products?limit=8&sort=newest`, {
      //cache: 'revalidate',
      next: { revalidate: 300 }
    })
    
    if (!res.ok) return { products: [] }
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return { products: [] }
  }
}

export default async function HomePage() {
  const { products } = await getFeaturedProducts()

  return (
    <div className="bg-[#f8f6f2] space-y-16">
      <Hero />
    
      <ShowcaseCarousel />
      <CategoryStrip />
      <SignatureShowcase />
      <LuxePerksRow />
      <PerksAndSignup />
      <ScrollTop />
       
    </div>
  )
}