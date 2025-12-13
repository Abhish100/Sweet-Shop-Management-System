import React from 'react'

export default function SkeletonCard() {
  return (
    <div className="bg-white p-4 rounded shadow animate-pulse">
      <div className="h-40 bg-gray-200 rounded mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
    </div>
  )
}
