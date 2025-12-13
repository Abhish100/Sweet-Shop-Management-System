import React from 'react'
import { render, screen } from '@testing-library/react'
import StateBoxes from '../components/StateBoxes'

describe('StateBoxes component', () => {
  it('renders heading and items with images and links', () => {
    render(<StateBoxes />)
    expect(screen.getByText('State-wise Famous Sweets of India')).toBeInTheDocument()
    // verify a few items render correctly with alt text
    expect(screen.getByAltText('Modur Pulao')).toBeInTheDocument()
    expect(screen.getByAltText('Pinni')).toBeInTheDocument()
    const link = screen.getAllByText('Image search')[0]
    expect(link).toHaveAttribute('href')
  })
})
