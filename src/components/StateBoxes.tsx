import React from 'react'

type StateSweet = {
  state: string
  emoji?: string
  image?: string
  sweet: string
  desc: string
  query: string
}

const ITEMS: StateSweet[] = [
  { state: 'Jammu & Kashmir', emoji: '🏔️', image: '/images/jammu-and-kashmir.svg', sweet: 'Modur Pulao', desc: 'A traditional Kashmiri sweet rice dish made with saffron, dry fruits, and ghee.', query: 'Modur Pulao Kashmiri sweet' },
  { state: 'Punjab', emoji: '🌾', image: '/images/punjab.svg', sweet: 'Pinni', desc: 'A rich, energy-packed sweet made with wheat flour, desi ghee, jaggery, and nuts.', query: 'Pinni Punjabi sweet' },
  { state: 'Uttar Pradesh', emoji: '🕌', image: '/images/uttar-pradesh.svg', sweet: 'Petha (Agra)', desc: 'A translucent, soft sweet made from ash gourd, famous for its unique texture.', query: 'Agra Petha sweet' },
  { state: 'Rajasthan', emoji: '🐄', image: '/images/rajasthan.svg', sweet: 'Ghewar', desc: 'A crispy, honeycomb-textured sweet soaked in sugar syrup.', query: 'Ghewar Rajasthani sweet' },
  { state: 'Gujarat', emoji: '🌊', image: '/images/gujarat.svg', sweet: 'Mohanthal', desc: 'A rich gram flour fudge flavored with cardamom and nuts.', query: 'Mohanthal Gujarati sweet' },
  { state: 'Maharashtra', emoji: '🌿', image: '/images/maharashtra.svg', sweet: 'Puran Poli', desc: 'A soft flatbread stuffed with a sweet lentil and jaggery filling.', query: 'Puran Poli Maharashtrian sweet' },
  { state: 'Madhya Pradesh', emoji: '🛕', image: '/images/madhya-pradesh.svg', sweet: 'Khoya Jalebi', desc: 'A richer version of jalebi made using milk solids, deep-fried and soaked in sugar syrup.', query: 'Khoya Jalebi Indore' },
  { state: 'Bihar', emoji: '🌾', image: '/images/bihar.svg', sweet: 'Thekua', desc: 'A traditional deep-fried sweet made with wheat flour and jaggery.', query: 'Thekua Bihari sweet' },
  { state: 'West Bengal', emoji: '🌴', image: '/images/west-bengal.svg', sweet: 'Rasgulla', desc: 'Soft, spongy cheese balls soaked in light sugar syrup.', query: 'Rasgulla Bengali sweet' },
  { state: 'Odisha', emoji: '🍃', image: '/images/odisha.svg', sweet: 'Chhena Poda', desc: 'A baked cottage cheese dessert with caramelized edges.', query: 'Chhena Poda Odia sweet' },
  { state: 'Assam', emoji: '🌾', image: '/images/assam.svg', sweet: 'Pitha', desc: 'Rice-based sweets prepared during festivals like Bihu, often filled with jaggery or coconut.', query: 'Assamese Pitha sweet' },
  { state: 'Sikkim', emoji: '🏞️', image: '/images/sikkim.svg', sweet: 'Sel Roti', desc: 'A mildly sweet, crispy rice flour bread, popular during festivals.', query: 'Sel Roti sweet' },
  { state: 'Telangana', emoji: '🌶️', image: '/images/telangana.svg', sweet: 'Pootharekulu', desc: 'Paper-thin rice starch sheets layered with jaggery and ghee.', query: 'Pootharekulu sweet' },
  { state: 'Andhra Pradesh', emoji: '🌴', image: '/images/andhra-pradesh.svg', sweet: 'Bobbatlu (Puran Poli)', desc: 'A soft flatbread stuffed with sweet lentils or coconut, flavored with cardamom.', query: 'Bobbatlu Andhra sweet' },
  { state: 'Tamil Nadu', emoji: '🌺', image: '/images/tamil-nadu.svg', sweet: 'Mysore Pak', desc: 'A rich, crumbly sweet made from gram flour, sugar, and ghee.', query: 'Mysore Pak sweet' },
  { state: 'Kerala', emoji: '🌴', image: '/images/kerala.svg', sweet: 'Palada Payasam', desc: 'A creamy rice pudding made with milk, sugar, and ghee.', query: 'Palada Payasam Kerala' },
]

export default function StateBoxes() {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-3">State-wise Famous Sweets of India</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {ITEMS.map(it => (
          <div key={it.state} className="bg-white rounded-md p-4 shadow min-h-[140px] flex gap-3">
            {it.image && (
              <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-50">
                <picture>
                  <source srcSet={`${it.image.replace(/\.svg$/, '.avif')}`} type="image/avif" />
                  <source srcSet={`${it.image.replace(/\.svg$/, '.webp')}`} type="image/webp" />
                  <img src={it.image} alt={it.sweet} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </picture>
              </div>
            )}
            <div>
              <div className="font-semibold">{it.state}</div>
              <div className="text-sm text-gray-700">{it.sweet}</div>
              <div className="text-xs text-gray-500 mt-2">{it.desc}</div>
              <div className="text-xs text-blue-600 mt-2">
                <a href={`https://www.google.com/search?q=${encodeURIComponent(it.query)}`} target="_blank" rel="noreferrer">Image search</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
