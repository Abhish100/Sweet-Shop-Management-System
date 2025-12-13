import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminSweets from './pages/AdminSweets'
import PromoBar from './components/PromoBar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'

function App() {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen bg-gray-50">
      <PromoBar />
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <nav className="flex-1 hidden sm:flex items-center gap-6 text-sm text-gray-700">
            <a href="#" className="hover:text-gray-900">Shop India</a>
            <a href="#" className="hover:text-gray-900">Festive Gifting</a>
            <a href="#" className="hover:text-gray-900">Our Story</a>
          </nav>
          <div className="flex-1 flex justify-center">
            <Link to="/" className="text-2xl font-serif font-bold">Sweet Shop</Link>
          </div>
          <div className="flex items-center gap-4">
            <button aria-label="search" className="text-gray-700 hover:text-gray-900">🔍</button>
            <button aria-label="cart" className="text-gray-700 hover:text-gray-900">🛒</button>
          </div>
          <div className="space-x-4">
            {user ? (
              <>
                <span className="text-sm">Welcome {user.username}</span>
                <button className="text-sm text-red-600" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-blue-600">Login</Link>
                <Link to="/register" className="text-sm text-blue-600">Register</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminSweets />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
