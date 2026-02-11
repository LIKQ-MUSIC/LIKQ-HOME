import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Popover, PopoverContent, PopoverTrigger } from './index'
import Button from '@/ui/Button'
import { Input } from '@/ui/Input'
import { Label } from '@/ui/Label'

const meta = {
  title: 'UI/Popover',
  component: Popover,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="flex items-center justify-center p-20">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-sm text-zinc-50">This is a popover content area.</p>
      </PopoverContent>
    </Popover>
  )
}

export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Settings</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-zinc-50">Settings</h4>
          <div className="space-y-2">
            <Label className="text-zinc-300" htmlFor="width">
              Width
            </Label>
            <Input
              id="width"
              defaultValue="100%"
              className="bg-zinc-900 border-zinc-700 text-zinc-50"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300" htmlFor="height">
              Height
            </Label>
            <Input
              id="height"
              defaultValue="auto"
              className="bg-zinc-900 border-zinc-700 text-zinc-50"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export const AlignCenter: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Center Aligned</Button>
      </PopoverTrigger>
      <PopoverContent align="center">
        <p className="text-sm text-zinc-50">Center-aligned popover</p>
      </PopoverContent>
    </Popover>
  )
}

export const AlignEnd: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">End Aligned</Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <p className="text-sm text-zinc-50">End-aligned popover</p>
      </PopoverContent>
    </Popover>
  )
}
