'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function LiveDemoModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full max-w-4xl bg-white rounded-3xl p-8 sm:p-10 shadow-xl"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-gray-700 hover:text-black"
        >
          ×
        </button>

        <h2 className="font-playfair text-2xl sm:text-3xl mb-6 text-center text-gray-900">
          Try Our Live Demo 
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative min-h-[380px]">
          {/* Rose-gold divider */}
          <span className="hidden md:block absolute inset-y-10 left-1/2 w-[1px] bg-[#d5a37e]/30" />

          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.35 }}
            className="space-y-4 pr-6 text-gray-700 relative z-10"
          >
            <p>
              <strong>1.</strong> Go to{' '}
              <a
                href="https://web.360world.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d5a37e] underline hover:text-[#b88658]"
              >
                web.360world.com
              </a>{' '}
              or scan the QR
            </p>
            <div className="flex justify-center">
              <Image
                src="/images/qr.jpg"
                width={200}
                height={200}
                alt="QR Code"
                className="rounded-lg shadow"
              />
            </div>
            <p>
              <strong>2.</strong> Create your account on the platform.
            </p>
            <p>
              <strong>3.</strong> Go to <strong>Events</strong> tab.
            </p>
          </motion.div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.35 }}
            className="space-y-4 pl-6 text-gray-700 relative z-10 flex flex-col items-center"
          >
            <p className="self-start">
              <strong>4.</strong> Search <u>Aurelia Jewels</u> & connect live!
            </p>
            <Image
              src="/images/360_demo.png"
              width={380}
              height={280}
              alt="360 Demo"
              className="rounded-lg shadow"
            />

            <a
              href="https://web.360world.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block px-8 py-3 rounded-full bg-black border border-[#d5a37e] text-white hover:bg-[#0c0c0c] hover:border-[#e7c49c] transition shadow-sm"
            >
              Connect Now →
            </a>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
