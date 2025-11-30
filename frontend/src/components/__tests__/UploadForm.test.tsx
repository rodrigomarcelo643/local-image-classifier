import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, test, expect } from 'vitest'
import UploadForm from '../UploadForm'

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('UploadForm', () => {
  test('renders upload form elements', () => {
    renderWithRouter(<UploadForm />)
    expect(screen.getByText(/drag.*drop/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument()
  })
})