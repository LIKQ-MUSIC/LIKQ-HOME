import Navbar from '@/components/Navbar'
import Section from '@/components/Section'
import { Title } from '@/ui/Typography'
import Microphone from '@/ui/Icons/Microphone'
import Card from '@/components/Card'
import VideoLanding from '@/components/VideoLanding'
import Works from '@/components/Works'
import Team from '@/components/Team'
import Contact from '@/components/Contact'
import Fansong from '@/ui/Icons/Fansong'
import Advertised from '@/ui/Icons/Advertised'
import MixMaster from '@/ui/Icons/MixMaster'
import WritingComposing from '@/ui/Icons/WritingComposing'
import Arrange from '@/ui/Icons/Arrange'

export default function Home() {
  const services = [
    {
      title: 'Writing and Composing',
      description: 'แต่งเพลงและแต่งทำนอง',
      icon: <WritingComposing className="text-primary" />
    },
    {
      title: 'Edit & Tune Vocal',
      description: 'จูนและแก้ไขเสียงร้อง',
      icon: <Microphone className="text-primary" />
    },
    {
      title: 'Arrange music',
      description: 'เรียบเรียงดนตรี',
      icon: <Arrange className="text-primary" />
    },
    {
      title: 'Mix & Mastering',
      description: 'ผสมเสียงและมาสเตอร์',
      icon: <MixMaster className="text-primary" />
    },
    {
      title: 'Advertised',
      description: 'แต่งเพลง ผลิตเพลง ประกอบโฆษณา',
      icon: <Advertised className="text-primary" />
    },
    {
      title: 'Music & Gift',
      description: 'Fansong ของขวัญ เนื่องในโอกาสพิเศษ',
      icon: <Fansong className="text-primary" />
    }
  ]
  return (
    <>
      <Section className="relative w-full p-0 md:p-0 bg-[#030827] overflow-hidden">
        {/* Background Video */}
        <VideoLanding />

        {/* Foreground Content */}
        <Navbar />
      </Section>

      <Section title="Our Services">
        <Title className="text-center" level={5}>
          บริการผลิตดนตรีหลากหลายรูปแบบ พร้อมทีมงานมืออาชีพมากประสบการณ์
        </Title>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          {services.map(service => (
            <Card key={service.title} {...service} />
          ))}
        </div>
      </Section>

      <Works />

      <Team />

      <Contact />

      <div className="bg-primary w-full h-[150px]" />
    </>
  )
}
