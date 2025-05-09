import Navbar from '@/components/Navbar'
import Section from '@/components/Section'
import { Title } from '@/ui/Typography'

export default function Home() {
  return (
    <>
      <Navbar />

      <Section title="Our Services">
        <Title level={5}>
          บริการผลิตดนตรีหลากหลายรูปแบบ พร้อมทีมงานมืออาชีพมากประสบการณ์
        </Title>
      </Section>
    </>
  )
}
