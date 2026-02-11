import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './index'
import Button from '@/ui/Button'

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <TooltipProvider>
        <div className="flex items-center justify-center p-20">
          <Story />
        </div>
      </TooltipProvider>
    )
  ]
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a tooltip</p>
      </TooltipContent>
    </Tooltip>
  )
}

export const Top: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Top</Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>Tooltip on top</p>
      </TooltipContent>
    </Tooltip>
  )
}

export const Bottom: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Bottom</Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>Tooltip on bottom</p>
      </TooltipContent>
    </Tooltip>
  )
}

export const Left: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Left</Button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Tooltip on left</p>
      </TooltipContent>
    </Tooltip>
  )
}

export const Right: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Right</Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>Tooltip on right</p>
      </TooltipContent>
    </Tooltip>
  )
}

export const AllSides: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm">
            Top
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Top</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm">
            Right
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Right</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm">
            Bottom
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Bottom</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm">
            Left
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Left</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
