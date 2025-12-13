import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TokenStorage } from '../utils/tokenStorage'
import AdminSweets from '../pages/AdminSweets'
import { AuthProvider } from '../context/AuthContext'
import * as sweetsService from '../services/sweets'

jest.mock('../services/sweets', () => ({
  fetchSweets: jest.fn().mockResolvedValue([{ id: '1', name: 'Choco', category: 'Chocolate', price: 1.5, quantity: 5 }]),
  createSweet: jest.fn().mockImplementation(async (s) => ({ id: '2', ...(s as any) })),
  updateSweet: jest.fn(),
  deleteSweet: jest.fn().mockResolvedValue({})
}))

jest.mock('../services/auth', () => ({ login: jest.fn(), register: jest.fn(), getProfile: jest.fn() }))
const mockedAuth = require('../services/auth')
mockedAuth.getProfile.mockImplementation(async () => ({ id: 'admin', username: 'admin', role: 'admin' }))

const mockSweets = [
  { id: '1', name: 'Choco', category: 'Chocolate', price: 1.5, quantity: 5 }
]

describe('Admin UI', () => {
  it('creates and deletes sweets', async () => {
    TokenStorage.set('admin-token')
    // Create mock admin via profile
    const { getByPlaceholderText, getByText } = render(
      <AuthProvider>
        <MemoryRouter>
          <AdminSweets />
        </MemoryRouter>
      </AuthProvider>
    )

    await waitFor(() => expect(screen.getByText('Choco')).toBeInTheDocument())

    fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'NewSweet' } })
    fireEvent.change(getByPlaceholderText('Category'), { target: { value: 'Candy' } })
    fireEvent.change(getByPlaceholderText('Price'), { target: { value: '2.5' } })
    fireEvent.change(getByPlaceholderText('Quantity'), { target: { value: '10' } })
    fireEvent.click(getByText('Create'))

    await waitFor(() => expect(screen.getByText('NewSweet')).toBeInTheDocument())

    // Delete new item - click confirm
    const confirmButton = screen.getAllByText('Delete')[0]
    fireEvent.click(confirmButton)
    // click confirm
    fireEvent.click(screen.getByText('Confirm!'))

    await waitFor(() => expect(sweetsService.deleteSweet).toHaveBeenCalled())
    TokenStorage.remove()
  })
})
