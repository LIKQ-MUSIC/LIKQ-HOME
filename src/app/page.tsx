import Navbar from '@/components/Navbar'
import Section from '@/components/Section'
import { Title } from '@/ui/Typography'
import Microphone from '@/ui/Icons/Microphone'
import Card from '@/components/Card'

export default function Home() {
  const services = [
    {
      title: 'Writing and Composing',
      description: 'แต่งเพลงและแต่งทำนอง',
      icon: <Microphone className="text-primary" />
    },
    {
      title: 'Music Production',
      description: 'Prod. / Songwriting Arranging',
      icon: <Microphone className="text-primary" />
    },
    {
      title: 'Music Production',
      description: 'Prod. / Songwriting Arranging',
      icon: <Microphone className="text-primary" />
    },
    {
      title: 'Music Production',
      description: 'Prod. / Songwriting Arranging',
      icon: <Microphone className="text-primary" />
    },
    {
      title: 'Music Production',
      description: 'Prod. / Songwriting Arranging',
      icon: <Microphone className="text-primary" />
    },
    {
      title: 'Music Production',
      description: 'Prod. / Songwriting Arranging',
      icon: <Microphone className="text-primary" />
    }
  ]
  return (
    <>
      <Section className="w-full p-0 bg-[#030827]">
        <Navbar />
      </Section>

      <Section title="Our Services">
        <Title level={5}>
          บริการผลิตดนตรีหลากหลายรูปแบบ พร้อมทีมงานมืออาชีพมากประสบการณ์
        </Title>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          {services.map(service => (
            <Card {...service} />
          ))}
        </div>
      </Section>

      <Section title="Our Works">
        <Title level={5}>ตัวอย่างผลงานของ LiKQ Music</Title>
      </Section>

      <Section title="Our Teams"></Section>
    </>
  )
}
