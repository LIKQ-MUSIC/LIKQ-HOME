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
  title: 'LiKQ MUSIC',
  description:
    'LiKQ MUSIC บริการด้านเสียงเพลงและความบันเทิง ครอบคลุมการสร้างสรรค์ ดนตรี การทำเพลง และการผลิตเนื้อหาเสียงคุณภาพสูง'
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
