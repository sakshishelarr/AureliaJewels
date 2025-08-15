import type { Metadata } from 'next'
import '@/app/globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'


export const metadata: Metadata = {
  title: 'Aurelia Jewels - Luxury Jewelry Collection',
  description: 'Discover exquisite handcrafted jewelry pieces that celebrate elegance and timeless beauty.',
  keywords: 'luxury jewelry, necklaces, earrings, rings, bracelets, handcrafted',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* 64px (h-16) + 2px hairline = ~66px */}
      <body className="min-h-screen bg-white text-gray-900  pt-16">
        <Navbar />
        
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}