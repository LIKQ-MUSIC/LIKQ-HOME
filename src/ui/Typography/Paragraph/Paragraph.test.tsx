import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Paragraph from './index'

describe('Paragraph Componnet', () => {
  it('should render correctly', () => {
    render(<Paragraph>Test</Paragraph>)

    const paragraph = screen.getByText('Test')
    expect(paragraph).toBeInTheDocument()
  })

  it('should apply custom class', () => {
    render(<Paragraph className="text-red-500">Test</Paragraph>)

    const paragraph = screen.getByText('Test')
    expect(paragraph).toHaveClass('text-red-500')
  })
})
