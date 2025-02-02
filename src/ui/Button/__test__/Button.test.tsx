import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../index'
import { buttonSizesClass, variantClasses } from '../constants'
import { ButtonSize, ButtonVariant } from '../types'

describe('Button Component', () => {
  it('renders the button with text', () => {
    render(<Button>Click Me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    // ensure button got default variant class
    expect(button).toHaveClass('bg-primary')
  })

  it('applies custom className correctly', () => {
    render(<Button className="custom-class">Styled Button</Button>)

    const button = screen.getByRole('button', { name: /styled button/i })
    expect(button).toHaveClass('custom-class')
  })

  it('triggers onClick function when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click Me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders ClientRipple component inside the button', () => {
    render(<Button>Click Me</Button>)

    const rippleContainer = screen.getByTestId('ripple-container')
    expect(rippleContainer).toBeInTheDocument()
  })

  it('should override default background color', () => {
    render(<Button className="bg-red-500">Click Me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toHaveClass('bg-red-500')

    // get default background color
    expect(button).not.toHaveClass('bg-primary')
  })

  // Disabled button case
  it('renders disabled button', () => {
    render(<Button disabled>Click Me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeDisabled()
  })

  // function should not be called when button is disabled
  it('should not call onClick function when button is disabled', () => {
    const handleClick = jest.fn()
    render(
      <Button disabled onClick={handleClick}>
        Click Me
      </Button>
    )

    const button = screen.getByRole('button', { name: /click me/i })
    fireEvent.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })
})

describe('Button Component Variants', () => {
  const variants: ButtonVariant[] = [
    'primary',
    'secondary',
    'ghost',
    'danger',
    'warning',
    'success',
    'outline'
  ]

  it.each(variants)('renders the %s variant with correct class', variant => {
    render(<Button variant={variant}>Click Me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })

    // Ensure the button has the dynamically assigned variant class
    expect(button).toHaveClass(variantClasses[variant])
  })
})

describe('Button Disabled State', () => {
  const testDisabledButton = (className?: string) => {
    render(
      <Button className={className} disabled>
        Click Me
      </Button>
    )

    const button = screen.getByRole('button', { name: /click me/i })

    expect(button).toHaveClass(
      'bg-disabled',
      'text-disabled-text',
      'cursor-not-allowed',
      'hover:bg-disabled'
    )

    // Ensure only `bg-disabled` is present and overrides other `bg-` classes
    const classes = button.className.split(' ')
    expect(classes.filter(c => c.startsWith('bg-'))).toEqual(['bg-disabled'])
  }

  it('should have bg-disabled and text-disabled-text when disabled', () => {
    testDisabledButton()
  })

  it('should override provided bg- class with bg-disabled', () => {
    testDisabledButton('bg-red-500')
  })

  it('disables the button correctly', () => {
    render(
      <Button variant="primary" disabled>
        Click Me
      </Button>
    )

    const button = screen.getByRole('button', { name: /click me/i })

    // Ensure disabled styles override variant classes
    expect(button).toHaveClass(
      'bg-disabled',
      'text-disabled-text',
      'cursor-not-allowed'
    )
    expect(button).not.toHaveClass(variantClasses['primary']) // Ensures `bg-gray-300` replaces `bg-primary`
  })
})

describe('Button Component Sizes', () => {
  const sizes: ButtonSize[] = ['sm', 'md', 'lg']

  it.each(sizes)('renders the %s size with correct class', size => {
    render(<Button size={size}>Click Me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toHaveClass(buttonSizesClass[size])
  })

  // check if className of height or padding can override default size
  it('should override default size with custom className', () => {
    render(
      <Button size="lg" className="h-20 px-10">
        Click Me
      </Button>
    )
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toHaveClass('h-20', 'px-10')
    expect(button).not.toHaveClass(buttonSizesClass['lg'])
  })
})
