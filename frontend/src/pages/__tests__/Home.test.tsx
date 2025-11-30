import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Home from '../Home'

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Home', () => {
  test('renders main buttons', () => {
    renderWithRouter(<Home />)
    expect(screen.getByText('Start Classifying')).toBeInTheDocument()
    expect(screen.getByText('Read the Docs')).toBeInTheDocument()
  })
})