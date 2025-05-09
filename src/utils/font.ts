import { Inter, Noto_Sans_Thai } from 'next/font/google'

export const inter = Inter({
  weight: 'variable',
  subsets: ['latin'],
  variable: '--font-inter'
})

export const notoSans = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['400', '700'], // or ["100", "300", "400", "500", "700", "900"]
  display: 'swap',
  variable: '--font-noto-sans-thai'
})
