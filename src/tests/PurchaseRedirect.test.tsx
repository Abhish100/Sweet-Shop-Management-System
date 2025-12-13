import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import { TokenStorage } from '../utils/tokenStorage'

jest.mock('../services/auth', () => ({ login: jest.fn(), register: jest.fn(), getProfile: jest.fn() }))
const mockedAuth = require('../services/auth')
mockedAuth.getProfile.mockImplementation(async () => null)

jest.mock('../services/sweets', () => ({
  fetchSweets: jest.fn().mockResolvedValue([{ id: '1', name: 'Choco', category: 'Chocolate', price: 1.5, quantity: 1 }]),
  purchaseSweet: jest.fn().mockResolvedValue({}),
  createSweet: jest.fn(),
  updateSweet: jest.fn(),
  deleteSweet: jest.fn()
}))

describe('Purchase redirect when unauthenticated', () => {
  it('opens sign-in modal when purchase clicked and user not logged in', async () => {
    TokenStorage.remove()
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    )

    await waitFor(() => expect(screen.getByText('Choco')).toBeInTheDocument())
    const btn = screen.getByLabelText('purchase-1')
    fireEvent.click(btn)
    // modal should open and show signin form
    await waitFor(() => expect(screen.getByLabelText('signin-form')).toBeInTheDocument())
    // fill in credentials
    mockedAuth.login.mockResolvedValue({ token: 'test-token' })
    mockedAuth.getProfile.mockResolvedValue({ id: 'u1', username: 'user', role: 'user' })
    fireEvent.change(screen.getByLabelText('signin-username'), { target: { value: 'user' } })
    fireEvent.change(screen.getByLabelText('signin-password'), { target: { value: 'password' } })
    fireEvent.click(screen.getByText('Sign in'))
    // after signin, purchase should be performed and quantity should become 0
    await waitFor(() => expect(screen.getByText('Qty: 0')).toBeInTheDocument())
  })
})
