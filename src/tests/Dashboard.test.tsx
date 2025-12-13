import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import { AuthProvider } from '../context/AuthContext'
import * as sweetsService from '../services/sweets'

jest.mock('../services/sweets', () => ({
  fetchSweets: jest.fn().mockResolvedValue([{ id: '1', name: 'Choco', category: 'Chocolate', price: 1.5, quantity: 5 }, { id: '2', name: 'Gummy', category: 'Gummies', price: 0.5, quantity: 0 }]),
  purchaseSweet: jest.fn(),
  createSweet: jest.fn(),
  updateSweet: jest.fn(),
  deleteSweet: jest.fn()
}))

jest.mock('../services/auth', () => ({ login: jest.fn(), register: jest.fn(), getProfile: jest.fn() }))

const mockedAuth = require('../services/auth')
mockedAuth.getProfile.mockImplementation(async () => ({ id: 'u1', username: 'user', role: 'user' }))

const mockSweets = [
  { id: '1', name: 'Choco', category: 'Chocolate', price: 1.5, quantity: 5 },
  { id: '2', name: 'Gummy', category: 'Gummies', price: 0.5, quantity: 0 },
]

describe('Dashboard', () => {
  it('renders sweets and shows out of stock and purchase button states', async () => {
    (sweetsService.fetchSweets as jest.Mock).mockResolvedValue(mockSweets)

    render(
      <AuthProvider>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </AuthProvider>
    )

    await waitFor(() => expect(screen.getByText('Choco')).toBeInTheDocument())
    expect(screen.getByText('Gummy')).toBeInTheDocument()
    expect(screen.getAllByText(/Qty:/)).toHaveLength(2)
    // disabled purchase button for out of stock
    expect(screen.getByLabelText('purchase-2')).toBeDisabled()
  })
})
