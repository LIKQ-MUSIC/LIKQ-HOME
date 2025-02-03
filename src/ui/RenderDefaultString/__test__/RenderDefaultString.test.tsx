import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import RenderedDefaultString from '../index'

describe('RenderedDefaultString Component', () => {
  test('renders fallback content when element is a string (static fallback)', () => {
    const text = 'Hello, World!'

    // Render the component with a static fallback
    render(
      <RenderedDefaultString element={text}>
        <h1>{text}</h1>
      </RenderedDefaultString>
    )

    // Verify that the h1 element is rendered with the correct text.
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent(text)
  })

  test('renders fallback content when element is a string (using render prop)', () => {
    const text = 'Dynamic Render Prop'

    // Render the component with a render prop as children
    render(
      <RenderedDefaultString element={text}>
        {value => <h2>{value}</h2>}
      </RenderedDefaultString>
    )

    // Verify that the h2 element is rendered with the correct text.
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent(text)
  })

  test('renders the provided element directly when element is not a string', () => {
    // Render the component with a React node as the element
    render(
      <RenderedDefaultString
        element={<div data-testid="custom-node">Custom Node</div>}
      >
        <h1>This fallback should not render</h1>
      </RenderedDefaultString>
    )

    // Verify that the custom node is rendered.
    const customNode = screen.getByTestId('custom-node')
    expect(customNode).toBeInTheDocument()
    expect(customNode).toHaveTextContent('Custom Node')

    // Also ensure that the fallback content is not rendered.
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull()
  })
})
