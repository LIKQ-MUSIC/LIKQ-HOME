'use client'

import Section from '@/components/Section'
import { Title } from '@/ui/Typography'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/ui/Carousel'
import Image from 'next/image'

import Autoplay from 'embla-carousel-autoplay'

const AboutUs = ({ images }: { images: { src: string; alt: string }[] }) => {
  return (
    <Section
      id="about-us"
      className="bg-[#030827] md:px-0 pr-4 text-white p-0 !py-0 overflow-hidden min-h-screen flex items-center"
    >
      <div className="w-full h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center w-full h-full">
          {/* Carousel - Left Side (Full Width) */}
          <div className="w-full order-2 lg:order-1 h-full min-h-[500px] lg:min-h-[600px] relative col-span-7">
            <Carousel
              opts={{
                align: 'start',
                loop: true
              }}
              plugins={[
                Autoplay({
                  delay: 4000
                })
              ]}
              className="w-full h-full relative group"
            >
              <CarouselContent className="h-full ml-0">
                {images.map(
                  (image: { src: string; alt: string }, index: number) => (
                    <CarouselItem
                      key={index}
                      className="basis-full pl-0 h-full"
                    >
                      <div className="relative w-full h-[500px] lg:h-screen">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
                        <div className="absolute bottom-6 left-6 text-white font-medium text-base md:text-xl bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm shadow-lg">
                          {image.alt}
                        </div>
                      </div>
                    </CarouselItem>
                  )
                )}
              </CarouselContent>
              {/* Navigation hidden by default, shown on hover if needed, or rely on autoplay */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-4 right-4 flex gap-2 z-10">
                <CarouselPrevious className="static translate-y-0 bg-black/50 hover:bg-white/20 border-white/20 text-white" />
                <CarouselNext className="static translate-y-0 bg-black/50 hover:bg-white/20 border-white/20 text-white" />
              </div>
            </Carousel>
          </div>

          {/* Text Content - Right Side */}
          <div className="space-y-8 order-1 lg:order-2 py-16 px-8 md:px-16 lg:px-24 text-center lg:text-left text-lg leading-relaxed text-gray-400 bg-[#030827] h-full flex flex-col justify-center col-span-5">
            <div className="mb-4">
              <Title level={2} className="text-white">
                About Us
              </Title>
            </div>
            <p className="text-xl">
              <strong className="text-white text-2xl">LiKQ Music</strong>{' '}
              คือทีมผลิตดนตรีครบวงจรที่มุ่งเน้นคุณภาพและความคิดสร้างสรรค์
              เราเชี่ยวชาญในงาน{' '}
              <strong className="text-white">Music Production</strong>{' '}
              ทุกขั้นตอน ตั้งแต่การเขียนเนื้อร้อง แต่งทำนอง เรียบเรียงดนตรี
              ไปจนถึงการมิกซ์และมาสเตอร์ริ่ง
            </p>
            <p>
              ไม่ว่าจะเป็นเพลง Original สำหรับศิลปิน, เพลงประกอบโฆษณา, แฟนซอง
              หรือโปรเจกต์พิเศษต่าง ๆ
              เราพร้อมดูแลและให้คำปรึกษาด้วยทีมงานมืออาชีพ
              เพื่อให้ได้ผลงานที่ตรงตามวิสัยทัศน์ของคุณมากที่สุด
            </p>

            <div className="pt-4">
              <button className="px-8 py-3 rounded-full border border-white/20 hover:bg-white hover:text-[#030827] transition-all duration-300 transform hover:scale-105">
                ดูผลงานของเรา
              </button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default AboutUs
