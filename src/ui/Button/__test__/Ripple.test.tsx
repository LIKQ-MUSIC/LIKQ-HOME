import { render, screen, fireEvent, act } from '@testing-library/react'
import ClientRipple from '../Ripple'

jest.useFakeTimers()

describe('ClientRipple', () => {
  it('renders without ripples initially', () => {
    render(<ClientRipple />)

    const rippleContainer = screen.getByTestId('ripple-container')
    expect(rippleContainer.children.length).toBe(0)
  })

  it('adds a ripple when clicked', () => {
    render(<ClientRipple />)

    const rippleContainer = screen.getByTestId('ripple-container')
    fireEvent.click(rippleContainer, { clientX: 50, clientY: 50 })

    expect(rippleContainer.children.length).toBe(1)
  })

  it('removes ripple after animation duration', () => {
    render(<ClientRipple />)

    const rippleContainer = screen.getByTestId('ripple-container')
    fireEvent.click(rippleContainer, { clientX: 50, clientY: 50 })

    act(() => {
      jest.advanceTimersByTime(600) // Simulate ripple animation duration
    })

    expect(rippleContainer.children.length).toBe(0)
  })
})
