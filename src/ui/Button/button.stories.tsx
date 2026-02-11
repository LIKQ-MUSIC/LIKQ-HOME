import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Button from './index'

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'ghost',
        'danger',
        'warning',
        'success',
        'outline'
      ]
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    },
    disabled: { control: 'boolean' }
  }
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'lg'
  }
}

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary'
  }
}

export const Ghost: Story = {
  args: {
    children: 'Ghost',
    variant: 'ghost'
  }
}

export const Danger: Story = {
  args: {
    children: 'Delete',
    variant: 'danger'
  }
}

export const Warning: Story = {
  args: {
    children: 'Warning',
    variant: 'warning'
  }
}

export const Success: Story = {
  args: {
    children: 'Confirm',
    variant: 'success'
  }
}

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline'
  }
}

export const Small: Story = {
  args: {
    children: 'Small',
    size: 'sm'
  }
}

export const Medium: Story = {
  args: {
    children: 'Medium',
    size: 'md'
  }
}

export const Large: Story = {
  args: {
    children: 'Large',
    size: 'lg'
  }
}

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true
  }
}

export const AllVariants: Story = {
  args: { children: 'All Variants' },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="success">Success</Button>
      <Button variant="outline">Outline</Button>
    </div>
  )
}

export const AllSizes: Story = {
  args: { children: 'All Sizes' },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  )
}
