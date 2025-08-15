'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative h-[70vh] md:h-[82vh] w-full overflow-hidden">

      {/* Subtle zoom anim on image */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 12, ease: 'linear' }}
      >
        <Image
          src="/images/home.jpg"
          alt="Aurelia diamond necklace"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-black/45" />

      {/* Content */}
      <div className="relative h-full">
        <div className="container mx-auto h-full px-4 flex flex-col justify-center">
          <div className="max-w-3xl text-white space-y-4">
            <motion.h1
              className="font-playfair font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Timeless elegance
            </motion.h1>

            <motion.p
              className="text-base md:text-lg text-white/90"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Discover the beauty of luxury jewelry
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <Link
                href="/products"
                className="inline-block mt-4 bg-softgold text-black font-semibold px-6 py-3 rounded-md hover:opacity-90 transition"
              >
                VIEW PRODUCTS
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
