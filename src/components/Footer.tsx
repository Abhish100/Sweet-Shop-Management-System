import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 mt-12">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold">Sweet Shop</h3>
          <p className="text-sm mt-2 text-gray-400">Crafting Indian sweets with care and tradition.</p>
          <div className="flex items-center gap-3 mt-4">
            <a aria-label="instagram" href="#" className="text-gray-400 hover:text-white">IG</a>
            <a aria-label="facebook" href="#" className="text-gray-400 hover:text-white">FB</a>
            <a aria-label="twitter" href="#" className="text-gray-400 hover:text-white">TW</a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-400">
            <li><Link to="#" className="hover:text-white">Sweets</Link></li>
            <li><Link to="#" className="hover:text-white">Gifts</Link></li>
            <li><Link to="#" className="hover:text-white">Collections</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Get in touch</h4>
          <p className="text-sm text-gray-400 mt-3">support@sweetshop.example</p>
          <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input aria-label="email" placeholder="Email address" className="flex-1 px-3 py-2 rounded bg-gray-800 text-gray-200 text-sm focus:outline-none" />
            <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded text-sm">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-4 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between">
          <span>© {new Date().getFullYear()} Sweet Shop — All rights reserved</span>
          <span>Made with care in India</span>
        </div>
      </div>
    </footer>
  )
}
