import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function BlogsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
