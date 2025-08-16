import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-playfair text-2xl font-semibold mb-4">Aurelia Jewels</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Crafting timeless elegance with exquisite handmade jewelry pieces that celebrate your unique story.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Collection</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?category=necklaces" className="text-gray-400 hover:text-white transition-colors">Necklaces</Link></li>
              <li><Link href="/products?category=earrings" className="text-gray-400 hover:text-white transition-colors">Earrings</Link></li>
              <li><Link href="/products?category=rings" className="text-gray-400 hover:text-white transition-colors">Rings</Link></li>
              <li><Link href="/products?category=bracelets" className="text-gray-400 hover:text-white transition-colors">Bracelets</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Customer Care</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-gray-400">Size Guide</span></li>
              <li><span className="text-gray-400">Care Instructions</span></li>
              <li><span className="text-gray-400">Returns & Exchanges</span></li>
              <li><span className="text-gray-400">Warranty</span></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <span className="text-2xl cursor-pointer hover:text-softgold transition-colors">📧</span>
              <span className="text-2xl cursor-pointer hover:text-softgold transition-colors">📱</span>
              <span className="text-2xl cursor-pointer hover:text-softgold transition-colors">📷</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Aurelia Jewels. All rights reserved. 
          </p>
        </div>
      </div>
    </footer>
  )
}