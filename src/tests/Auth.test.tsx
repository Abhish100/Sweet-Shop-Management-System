import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import Login from '../pages/Login'
import { AuthProvider } from '../context/AuthContext'
import * as authService from '../services/auth'

jest.mock('../services/auth', () => ({ login: jest.fn(), register: jest.fn(), getProfile: jest.fn() }))

const mockedAuth = require('../services/auth')

mockedAuth.login.mockImplementation(async () => ({ token: 'abc' }))
mockedAuth.getProfile.mockImplementation(async () => ({ id: '1', username: 'u', role: 'user' }))

describe('Login page', () => {
  it('submits login and navigates on success', async () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthProvider>
    )

    fireEvent.change(screen.getByLabelText('username'), { target: { value: 'u' } })
    fireEvent.change(screen.getByLabelText('password'), { target: { value: 'p' } })
    fireEvent.submit(screen.getByLabelText('login-form'))

    await waitFor(() => expect(authService.login).toHaveBeenCalled())
  })
})
