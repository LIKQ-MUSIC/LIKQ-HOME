import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Label } from './index'
import { Input } from '@/ui/Input'

const meta = {
  title: 'UI/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' }
  }
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Username'
  }
}

export const Required: Story = {
  render: () => (
    <Label>
      Email <span className="text-red-500">*</span>
    </Label>
  )
}

export const WithInput: Story = {
  render: () => (
    <div className="space-y-2 max-w-sm">
      <Label htmlFor="name">Full Name</Label>
      <Input id="name" placeholder="John Doe" />
    </div>
  )
}
