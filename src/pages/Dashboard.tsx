import React, { useEffect, useMemo, useState } from 'react'
import { fetchSweets, Sweet as SweetType } from '../services/sweets'
import SweetCard from '../components/SweetCard'
import useDebounce from '../hooks/useDebounce'
import Hero from '../components/Hero'
import StateBoxes from '../components/StateBoxes'
import SkeletonCard from '../components/SkeletonCard'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const categoriesFrom = (items: SweetType[] | any) => Array.from(new Set((Array.isArray(items) ? items : []).map((i: any) => i.category)))

export default function Dashboard() {
  const { user } = useAuth()
  const [sweets, setSweets] = useState<SweetType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])

  const debouncedQuery = useDebounce(query, 250)

  useEffect(() => {
    setLoading(true)
    fetchSweets()
      .then(data => setSweets(data))
      .catch(e => setError('Failed to fetch sweets'))
      .finally(() => setLoading(false))
  }, [])

  const categories = useMemo(() => categoriesFrom(sweets), [sweets])

  const filtered = useMemo(() => {
    return sweets.filter(s =>
      s.name.toLowerCase().includes(debouncedQuery.toLowerCase()) &&
      (!category || s.category === category) &&
      s.price >= priceRange[0] && s.price <= priceRange[1]
    )
  }, [sweets, debouncedQuery, category, priceRange])

  const onPurchase = (updated: SweetType) => {
    setSweets(prev => prev.map(s => s.id === updated.id ? updated : s))
  }

  return (
    <div>
      <Hero />
      <StateBoxes />
      <div className="mb-4 flex gap-4 items-center">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search sweets" className="border rounded px-3 py-2 flex-1" aria-label="search" />
        <select value={category} onChange={e => setCategory(e.target.value)} className="border rounded px-3 py-2" aria-label="category-filter">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex items-center gap-2">
          <input type="number" value={priceRange[0]} onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])} className="w-24 border rounded px-2 py-1" aria-label="min-price" />
          <span className="text-sm">-</span>
          <input type="number" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])} className="w-24 border rounded px-2 py-1" aria-label="max-price" />
        </div>
      </div>

      {user?.role === 'admin' && <div className="mb-4"><Link to="/admin" className="text-sm text-blue-600">Admin panel</Link></div>}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}
      {error && <div className="text-red-600">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map(s => (
          <SweetCard key={s.id} sweet={s} onPurchase={onPurchase} />
        ))}
      </div>
    </div>
  )
}
