import type { Preview } from '@storybook/nextjs-vite'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f8f9fb' },
        { name: 'dark', value: '#020617' },
        { name: 'white', value: '#ffffff' }
      ]
    }
  }
}

export default preview
