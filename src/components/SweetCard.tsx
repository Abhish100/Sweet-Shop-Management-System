import React from 'react'
import { Sweet as SweetType, purchaseSweet } from '../services/sweets'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import SignInModal from './SignInModal'

export default function SweetCard({ sweet, onPurchase }: { sweet: SweetType, onPurchase: (s: SweetType) => void }) {
  const [loading, setLoading] = React.useState(false)
  const [imgLoaded, setImgLoaded] = React.useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showModal, setShowModal] = React.useState(false)
  const handlePurchase = async () => {
    if (!user) {
      // open sign-in modal instead of redirecting to login page
      setShowModal(true)
      return
    }
    setLoading(true)
    try {
      await purchaseSweet(sweet.id)
      onPurchase({ ...sweet, quantity: sweet.quantity - 1 })
    } catch (e) {
      // handle error (toast etc)
    } finally { setLoading(false) }
  }

  return (
    <div className="bg-white p-4 rounded shadow flex gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold">{sweet.name}</h3>
          <div className="text-sm text-gray-500">{sweet.category}</div>
        </div>
        <div className="text-right">
          <div className="font-semibold">${sweet.price.toFixed(2)}</div>
          <div className="text-sm">Qty: {sweet.quantity}</div>
        </div>
      </div>
      {sweet.image && (
        <div className="w-28 h-28 flex-shrink-0 overflow-hidden rounded">
          <picture>
            <source srcSet={`${sweet.image.replace(/\.[a-z]+$/, '.avif')}`} type="image/avif" />
            <source srcSet={`${sweet.image.replace(/\.[a-z]+$/, '.webp')}`} type="image/webp" />
            <img
              src={sweet.image}
              alt={sweet.name}
              loading="lazy"
              decoding="async"
              className={`w-full h-full object-cover ${imgLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
              onLoad={() => setImgLoaded(true)}
            />
          </picture>
        </div>
      )}
      <div className="mt-3 ml-auto flex justify-end">
        <button
          className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
          onClick={handlePurchase}
          disabled={sweet.quantity === 0 || loading}
          aria-label={`purchase-${sweet.id}`}
        >
          {sweet.quantity === 0 ? 'Out of stock' : loading ? 'Purchasing...' : 'Purchase'}
        </button>
      </div>
      <SignInModal open={showModal} onClose={() => setShowModal(false)} onLoginSuccess={async () => {
        setShowModal(false)
        // after logging in, proceed with the purchase
        setLoading(true)
        try {
          await purchaseSweet(sweet.id)
          onPurchase({ ...sweet, quantity: sweet.quantity - 1 })
        } catch (e) {
          // ignore for now
        } finally { setLoading(false) }
      }} />
    </div>
  )
}
