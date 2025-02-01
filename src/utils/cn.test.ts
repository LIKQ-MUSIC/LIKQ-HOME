import { cn } from './cn'

describe('cn utility function', () => {
  it('merges multiple class names correctly', () => {
    const result = cn('btn', 'btn-primary', 'text-lg')
    expect(result).toBe('btn btn-primary text-lg')
  })

  it('ignores falsey/undefined/null values', () => {
    const result = cn('btn', false, undefined, null, 'active')
    expect(result).toBe('btn active')
  })

  it('merges conflicting Tailwind classes using tailwind-merge', () => {
    // tailwind-merge will keep the last conflicting class
    const result = cn('p-2', 'p-4')
    expect(result).toBe('p-4')
  })

  it('properly merges dynamic class objects using clsx', () => {
    const isActive = true
    const isDisabled = false
    const result = cn(
      'btn',
      {
        active: isActive,
        disabled: isDisabled
      },
      'text-center'
    )
    // disabled is false, so it should not appear
    expect(result).toBe('btn active text-center')
  })
})
