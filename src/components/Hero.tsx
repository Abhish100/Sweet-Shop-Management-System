import React, { useEffect, useRef, useState } from 'react'

const Hero: React.FC<{title?: string, subtitle?: string, cta?: string, imageUrl?: string}> = ({ title='Yeh Diwali, Mittho Laage!', subtitle="A pinch of nostalgia, a handful of love – that's the magic of festive mithai", cta='Shop Now', imageUrl }) => {
  const bg = imageUrl || '/images/hero.svg'
  return (
    <section className="w-full rounded-md overflow-hidden mb-6 relative">
      <div className="relative h-64 sm:h-[420px] bg-center bg-cover rounded-md" style={{ backgroundImage: `url('${bg}')` }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">{title}</h1>
          <p className="text-sm text-white/90 max-w-xl mt-3">{subtitle}</p>
          <a href="#" className="mt-4 inline-block bg-rose-600 text-white px-4 py-2 rounded text-sm">{cta}</a>
        </div>
      </div>
    </section>
  )
}

export default Hero
