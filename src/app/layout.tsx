import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { inter, notoSans } from '@/utils/font'
import ReactQueryProvider from '@/provider/ReactQueryProvider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.likqmusic.com'),
  title: {
    default: 'LiKQ MUSIC | Production & Entertainment Services',
    template: '%s | LiKQ MUSIC'
  },
  description:
    'LiKQ MUSIC บริการด้านเสียงเพลงและความบันเทิง ครอบคลุมการสร้างสรรค์ ดนตรี การทำเพลง และการผลิตเนื้อหาเสียงคุณภาพสูง พร้อมทีมงานมืออาชีพ',
  keywords: [
    'LiKQ MUSIC',
    'Music Production',
    'Entertainment',
    'Songwriting',
    'Mixing',
    'Mastering',
    'Vocal Tuning',
    'Thailnd Music',
    'แต่งเพลง',
    'ทำเพลง',
    'มิกซ์เสียง',
    'มาสเตอร์ริ่ง'
  ],
  authors: [{ name: 'LiKQ MUSIC Team' }],
  creator: 'LiKQ MUSIC',
  publisher: 'LiKQ MUSIC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  openGraph: {
    title: 'LiKQ MUSIC | Production & Entertainment Services',
    description:
      'LiKQ MUSIC บริการด้านเสียงเพลงและความบันเทิง ครอบคลุมการสร้างสรรค์ ดนตรี การทำเพลง และการผลิตเนื้อหาเสียงคุณภาพสูง',
    url: 'https://www.likqmusic.com',
    siteName: 'LiKQ MUSIC',
    locale: 'th_TH',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg', // Ensure this image exists or is added later
        width: 1200,
        height: 630,
        alt: 'LiKQ MUSIC Production'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LiKQ MUSIC',
    description:
      'LiKQ MUSIC บริการด้านเสียงเพลงและความบันเทิง ครอบคลุมการสร้างสรรค์ ดนตรี การทำเพลง และการผลิตเนื้อหาเสียงคุณภาพสูง',
    images: ['/twitter-image.jpg'] // Ensure this image exists or is added later
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${notoSans.variable} antialiased`}
      >
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  )
}
