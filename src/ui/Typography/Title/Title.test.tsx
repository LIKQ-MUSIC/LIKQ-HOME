import '@testing-library/jest-dom'
import Title from './index'
import { render, screen } from '@testing-library/react'

describe('Title Component', () => {
  it('renders the correct heading level', () => {
    render(<Title level={1}>Test Title</Title>)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it('applies the correct text size class', () => {
    render(<Title level={3}>Test Title</Title>)
    const heading = screen.getByText('Test Title')
    expect(heading).toHaveClass('text-[length:--font-size-h3]')
  })

  it('applies additional custom classes', () => {
    render(
      <Title level={2} className="text-red-500">
        Custom Title
      </Title>
    )
    const heading = screen.getByText('Custom Title')
    expect(heading).toHaveClass('text-red-500')
    expect(heading).toHaveClass('text-[length:--font-size-h2]')
  })
})
