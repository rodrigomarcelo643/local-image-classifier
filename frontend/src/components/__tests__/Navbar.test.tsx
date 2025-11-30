import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Navbar from '../Navbar'

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Navbar', () => {
  test('renders navigation links', () => {
    const mockUser = { email: 'test@example.com', name: 'Test User' }
    const mockOnLogout = () => {}
    
    renderWithRouter(<Navbar user={mockUser} onLogout={mockOnLogout} />)
    expect(screen.getByText('Upload Image')).toBeInTheDocument()
    expect(screen.getByText('Test Model')).toBeInTheDocument()
    expect(screen.getByText('Trained Models')).toBeInTheDocument()
  })
})