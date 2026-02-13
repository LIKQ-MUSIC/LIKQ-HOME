'use client'

import React from 'react'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/ui/Carousel'

interface HeroCarouselProps {
  images: { src: string; alt: string }[]
}

const HeroCarousel = ({ images }: HeroCarouselProps) => {
  return (
    <section className="relative w-full h-[100dvh] bg-[#030827] overflow-hidden">
      {/* Carousel Background */}
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
          {images.map((image, index) => (
            <CarouselItem key={index} className="basis-full pl-0 h-full">
              <div className="relative w-full h-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  quality={75}
                  className="object-cover"
                />
                {/* Overlay gradient for text readability */}
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Hero Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10 px-4 pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-prompt text-white mb-6 drop-shadow-2xl tracking-tighter">
            Crafting Your Vibe. <br className="hidden md:block" /> Defining Your
            Sound
          </h1>
          <p
            className="text-xl md:text-2xl mt-2 md:mt-4 text-gray-200 mb-10 max-w-3xl mx-auto drop-shadow-md font-medium leading-relaxed opacity-0 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            ดีไซน์ตัวตนผ่านเสียงเพลง <br className="md:hidden" />{' '}
            บรรเลงทุกคำให้เป็นคุณ
          </p>
          <a
            href="#contact"
            className="inline-block px-10 py-4 bg-white text-[#030827] text-lg font-semibold rounded-full 
                       hover:bg-[#E8EAEE] hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] opacity-0 animate-scale-in"
            style={{ animationDelay: '0.4s' }}
          >
            เริ่มโปรเจกต์กับเรา
          </a>
        </div>
      </div>
    </section>
  )
}

export default HeroCarousel
