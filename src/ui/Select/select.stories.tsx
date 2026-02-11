import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from './index'
import { Label } from '@/ui/Label'

const meta = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs']
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  )
}

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a service" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Production</SelectLabel>
          <SelectItem value="music">Music Production</SelectItem>
          <SelectItem value="video">Video Production</SelectItem>
          <SelectItem value="photo">Photography</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Event</SelectLabel>
          <SelectItem value="concert">Concert</SelectItem>
          <SelectItem value="festival">Festival</SelectItem>
          <SelectItem value="private">Private Event</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2 max-w-sm">
      <Label>Category</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="music">Music</SelectItem>
          <SelectItem value="video">Video</SelectItem>
          <SelectItem value="event">Event</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Disabled select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
      </SelectContent>
    </Select>
  )
}

export const WithDisabledItem: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Available</SelectItem>
        <SelectItem value="option2" disabled>
          Unavailable
        </SelectItem>
        <SelectItem value="option3">Available</SelectItem>
      </SelectContent>
    </Select>
  )
}
