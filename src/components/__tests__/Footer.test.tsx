import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Footer from '../Footer'

describe('Footer', () => {
  it('renders brand, links, and newsletter', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    )
    expect(screen.getByText(/Sweet Shop/)).toBeInTheDocument()
    expect(screen.getByText(/Sweets/)).toBeInTheDocument()
    expect(screen.getByLabelText('email')).toBeInTheDocument()
  })
})
