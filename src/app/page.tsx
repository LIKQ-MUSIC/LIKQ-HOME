import Section from '@/components/Section'
import Navbar from '@/components/Navbar'
import { Title } from '@/ui/Typography'
import Microphone from '@/ui/Icons/Microphone'
import Card from '@/components/Card'
import HeroCarousel from '@/components/HeroCarousel'
import Works from '@/components/Works'
import Team from '@/components/Team'
import Footer from '@/components/Footer'
import Fansong from '@/ui/Icons/Fansong'
import Advertised from '@/ui/Icons/Advertised'
import MixMaster from '@/ui/Icons/MixMaster'
import WritingComposing from '@/ui/Icons/WritingComposing'
import Arrange from '@/ui/Icons/Arrange'
import AboutUs from '@/components/AboutUs'
import { getAboutUsImages } from '@/services/about-us'

import { apiClient } from '@/lib/api-client'
import { IWorkItem } from '@/components/Works/types'
import dayjs from '@/utils/dayjs'

export const revalidate = 3600 // Verify static rebuild every hour if revalidated

async function getWorks(): Promise<IWorkItem[]> {
  try {
    const response = await apiClient.get('/works')

    // Transform API response to IWorkItem matches
    return response.data.data.map((item: any) => ({
      title: item.title,
      category: item.category,
      description: item.description,
      // Map media_ids or image_url from API to 'image' field if available.
      // API might return standard fields, adjusting mapping as needed.
      // For now, assume API returns close match or we map basically.
      // If we don't have full media resolution in GET /works yet, we might miss images unless /works joins them.
      // Let's assume basic mapping for now.
      image: item.image_url || '', // Fallback or if API still returns it
      youtubeId: item.youtube_id,
      url: item.external_url,
      start: item.start_date || undefined,
      end: item.end_date || undefined,
      location: item.location
    }))
  } catch (error) {
    console.error('Failed to fetch works for SSG:', error)
    return []
  }
}

export default async function Home() {
  const worksData = await getWorks()
  const aboutUsData = await getAboutUsImages()

  // Map to component format or use default if empty/failed
  const aboutUsImages =
    aboutUsData && aboutUsData.length > 0
      ? aboutUsData.map((img: any) => ({
          src: img.image_url,
          alt: img.alt_text || ''
        }))
      : []

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
      <Navbar />
      <HeroCarousel images={aboutUsImages} />

      <AboutUs />

      <Section id="services" title="Our Services">
        <Title className="text-center" level={5}>
          บริการผลิตดนตรีหลากหลายรูปแบบ พร้อมทีมงานมืออาชีพมากประสบการณ์
        </Title>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          {services.map(service => (
            <Card key={service.title} {...service} />
          ))}
        </div>
      </Section>

      <Works items={worksData} />

      <Team />

      <Footer />
    </>
  )
}
