import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'

jest.mock('../services/auth', () => ({ login: jest.fn(), register: jest.fn(), getProfile: jest.fn() }))

const mocked = require('../services/auth')

mocked.getProfile.mockImplementation(async () => null)

test('redirects to login when unauthenticated', () => {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/" element={<ProtectedRoute><div>Private</div></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  )
  expect(screen.getByText('Login Page')).toBeInTheDocument()
})
