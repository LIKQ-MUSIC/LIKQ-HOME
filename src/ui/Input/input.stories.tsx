import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Input } from './index'
import { Label } from '@/ui/Label'

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url']
    },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    placeholder: { control: 'text' }
  }
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...'
  }
}

export const WithValue: Story = {
  args: {
    defaultValue: 'Hello World'
  }
}

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'name@example.com'
  }
}

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password'
  }
}

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true
  }
}

export const WithError: Story = {
  args: {
    placeholder: 'Invalid input',
    error: true,
    defaultValue: 'invalid@'
  }
}

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2 max-w-sm">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="name@example.com" />
    </div>
  )
}

export const WithErrorAndLabel: Story = {
  render: () => (
    <div className="space-y-2 max-w-sm">
      <Label htmlFor="email-err">Email</Label>
      <Input
        id="email-err"
        type="email"
        error
        placeholder="name@example.com"
        defaultValue="invalid"
      />
      <p className="text-sm text-red-500">
        Please enter a valid email address.
      </p>
    </div>
  )
}
