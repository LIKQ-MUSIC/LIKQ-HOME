import Navbar from '@/components/Navbar'
import Section from '@/components/Section'
import { Title } from '@/ui/Typography'
import Microphone from '@/ui/Icons/Microphone'
import Card from '@/components/Card'
import VideoLanding from '@/components/VideoLanding'
import Works from '@/components/Works'

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
      <Section className="relative w-full p-0 bg-[#030827] overflow-hidden">
        {/* Background Video */}
        <VideoLanding />

        {/* Foreground Content */}
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

      <Works />

      <Section title="Our Teams"></Section>
    </>
  )
}
