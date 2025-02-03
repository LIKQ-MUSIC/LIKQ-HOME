import '@testing-library/jest-dom'

import { render, screen, fireEvent } from '@testing-library/react'
import Microphone from '@/ui/Icons/Microphone'
import Card from '../index'

describe('Card Component', () => {
  const props = {
    title: 'Music for Artist',
    description: 'Prod. / Songwriting Arranging',
    icon: <Microphone data-testid="card-icon" /> // Mock icon
  }

  it('renders card with title, description, and icon', () => {
    render(<Card {...props} />)

    expect(screen.getByText(props.title)).toBeInTheDocument()
    expect(screen.getByText(props.description)).toBeInTheDocument()
    expect(screen.getByTestId('card-icon')).toBeInTheDocument()
  })

  it('applies hover shadow effect', () => {
    render(<Card {...props} />)

    const card = screen.getByTestId('card')

    // Before hover
    expect(card).toHaveClass('shadow-md')

    // Simulate hover
    fireEvent.mouseOver(card)
    expect(card).toHaveClass('hover:shadow-lg')
  })

  it('renders the gradient background', () => {
    render(<Card {...props} />)
    const gradient = screen
      .getByTestId('card')
      .querySelector('.bg-gradient-to-b')
    expect(gradient).toBeInTheDocument()
  })

  it('renders custom icon', () => {
    render(
      <Card
        title="Music for Artist"
        description="Prod. / Songwriting Arranging"
        icon={<div data-testid="custom-icon" className="w-8 h-8 bg-red-500" />}
      />
    )

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  // render custom reactNode title and description override the default <Title> component
  it('renders custom title and description', () => {
    const { container } = render(
      <Card
        title={<h1 data-testid="custom-title">Custom Title</h1>}
        description={
          <div data-testid="custom-description">Custom Description</div>
        }
        icon={<Microphone />}
      />
    )

    // Verify that the custom title is rendered as an h1
    const customTitle = screen.getByTestId('custom-title')
    expect(customTitle).toBeInTheDocument()
    expect(customTitle.tagName).toBe('H1')

    // Verify that the custom description is rendered as a paragraph
    const customDescription = screen.getByTestId('custom-description')
    expect(customDescription).toBeInTheDocument()
    expect(customDescription.tagName).toBe('DIV')

    // Ensure that no default <h5> title is rendered
    expect(container.querySelector('h5')).toBeNull()
    // Ensure no default description P is rendered
    expect(container.querySelector('p')).toBeNull()
  })
})
