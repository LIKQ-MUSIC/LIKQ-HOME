import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/ui/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: '#153051',
          hover: '#132b49',
          active: '#112641',
          light: '#E8EAEE'
        },
        secondary: {
          DEFAULT: '#BEADC4',
          hover: '#ab9cb0',
          active: '#988a9d',
          dark: {
            DEFAULT: '#8f8293'
          },
          light: {
            DEFAULT: '#f9f7f9'
          }
        },
        danger: {
          DEFAULT: '#ba1a1a',
          hover: '#a71717',
          active: '#951515'
        },
        warning: {
          DEFAULT: '#f46f4e',
          hover: '#dc6446',
          active: '#c3593e'
        },
        success: {
          DEFAULT: '#00a991',
          hover: '#009883',
          active: '#008774'
        },
        disabled: {
          DEFAULT: '#E8EAEE',
          text: '#B6BFC9'
        }
      },
      fontSize: {
        h3: [
          '18px',
          {
            fontWeight: 700,
            lineHeight: '24px'
          }
        ]
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards'
      }
    }
  },
  plugins: []
} satisfies Config
