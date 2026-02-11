import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Textarea } from './index'
import { Label } from '@/ui/Label'

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    placeholder: { control: 'text' },
    rows: { control: 'number' }
  }
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter your message...'
  }
}

export const WithValue: Story = {
  args: {
    defaultValue:
      'This is a sample message that demonstrates the textarea component with pre-filled content.',
    rows: 4
  }
}

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled textarea',
    disabled: true
  }
}

export const WithError: Story = {
  args: {
    placeholder: 'Required field',
    error: true,
    defaultValue: ''
  }
}

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2 max-w-md">
      <Label htmlFor="bio">Bio</Label>
      <Textarea id="bio" placeholder="Tell us about yourself..." rows={4} />
    </div>
  )
}

export const WithErrorAndLabel: Story = {
  render: () => (
    <div className="space-y-2 max-w-md">
      <Label htmlFor="desc">
        Description <span className="text-red-500">*</span>
      </Label>
      <Textarea id="desc" error placeholder="Required" />
      <p className="text-sm text-red-500">This field is required.</p>
    </div>
  )
}
