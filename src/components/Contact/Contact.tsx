import React from 'react'
import Section from '@/components/Section'
import { Title } from '@/ui/Typography'
import { Mail, Phone } from 'lucide-react'
import Line from '@/ui/Icons/Line'

interface ContactItem {
  icon: React.ReactNode
  text: string
}

const contactList: ContactItem[] = [
  {
    icon: <Phone className="w-5 h-5 text-white" />,
    text: '092-409-0388'
  },
  {
    icon: <Line className="w-5 h-5" />,
    text: 'LoveJesusz'
  },
  {
    icon: <Mail className="w-5 h-5 text-white" />,
    text: 'contact@likqmusic.com'
  }
]

const Contact = () => (
  <Section className="min-h-[33dvh]" title="Contact">
    <Title className="text-center" level={5}>
      ติดตามและสอบถามได้ทุกช่องทาง
    </Title>

    <div className="flex justify-start flex-col space-y-4 mt-8">
      {contactList.map(c => (
        <div key={c.text} className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            {c.icon}
          </div>{' '}
          <Title className="text-center" level={6}>
            {c.text}
          </Title>
        </div>
      ))}
    </div>
  </Section>
)

export default Contact
