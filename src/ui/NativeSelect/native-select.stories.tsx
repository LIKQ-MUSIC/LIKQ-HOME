import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { NativeSelect } from './index'
import { Label } from '@/ui/Label'

const meta = {
  title: 'UI/NativeSelect',
  component: NativeSelect,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    error: { control: 'boolean' }
  }
} satisfies Meta<typeof NativeSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <NativeSelect {...args}>
      <option value="">Select an option</option>
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
      <option value="option3">Option 3</option>
    </NativeSelect>
  )
}

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2 max-w-sm">
      <Label htmlFor="category">Category</Label>
      <NativeSelect id="category">
        <option value="">Select category</option>
        <option value="music">Music</option>
        <option value="video">Video</option>
        <option value="event">Event</option>
      </NativeSelect>
    </div>
  )
}

export const Disabled: Story = {
  render: () => (
    <NativeSelect disabled>
      <option value="">Disabled select</option>
      <option value="option1">Option 1</option>
    </NativeSelect>
  )
}

export const WithError: Story = {
  render: () => (
    <div className="space-y-2 max-w-sm">
      <Label htmlFor="req">
        Required Field <span className="text-red-500">*</span>
      </Label>
      <NativeSelect id="req" error>
        <option value="">Select an option</option>
        <option value="option1">Option 1</option>
      </NativeSelect>
      <p className="text-sm text-red-500">Please select an option.</p>
    </div>
  )
}
