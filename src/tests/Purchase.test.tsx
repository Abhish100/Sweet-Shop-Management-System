import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TokenStorage } from '../utils/tokenStorage'
import Dashboard from '../pages/Dashboard'
import { AuthProvider } from '../context/AuthContext'
import * as sweetsService from '../services/sweets'

jest.mock('../services/sweets', () => ({
  fetchSweets: jest.fn().mockResolvedValue([{ id: '1', name: 'Choco', category: 'Chocolate', price: 1.5, quantity: 1 }]),
  purchaseSweet: jest.fn().mockResolvedValue({ id: '1', name: 'Choco', category: 'Chocolate', price: 1.5, quantity: 0 }),
  createSweet: jest.fn(),
  updateSweet: jest.fn(),
  deleteSweet: jest.fn()
}))

jest.mock('../services/auth', () => ({ login: jest.fn(), register: jest.fn(), getProfile: jest.fn() }))
const mockedAuth = require('../services/auth')
mockedAuth.getProfile.mockImplementation(async () => ({ id: 'u1', username: 'user', role: 'user' }))

const mockSweets = [
  { id: '1', name: 'Choco', category: 'Chocolate', price: 1.5, quantity: 1 }
]

describe('Purchase flow', () => {
  it('decrements quantity when purchased', async () => {
    TokenStorage.set('test-token')
    render(
      <AuthProvider>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </AuthProvider>
    )

    await waitFor(() => expect(screen.getByText('Choco')).toBeInTheDocument())

    const btn = screen.getByLabelText('purchase-1')
    expect(btn).not.toBeDisabled()
    fireEvent.click(btn)
    await waitFor(() => expect(btn).toBeDisabled())
    expect(screen.getByText('Qty: 0')).toBeInTheDocument()
    TokenStorage.remove()
  })
})
