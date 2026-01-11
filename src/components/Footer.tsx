import React from 'react'
import { Title } from '@/ui/Typography'
import Youtube from '@/ui/Icons/YouTube'
import Mailbox from '@/ui/Icons/Mailbox'
import SoundCloud from '@/ui/Icons/SoundCloud'

const Footer = () => {
    return (
        <footer id="contact" className="bg-[#153051] text-white py-12 md:py-16">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">

                    {/* Contact Info & Socials */}
                    <div className="footer-info flex flex-col space-y-8">
                        <div className="contact-list space-y-4">
                            <Title level={3} className="text-white mb-6">ติดต่อเรา</Title>
                            <p className="text-white/90 text-lg">โทรศัพท์: 092-409-0388 (คุณนพ Producer)</p>
                            <p className="text-white/90 text-lg">
                                อีเมล: <a href="mailto:contact@likqmusic.com" className="hover:underline">contact@likqmusic.com</a>
                            </p>
                        </div>

                        <div className="social-links">
                            <Title level={4} className="text-white mb-4 text-xl">ติดตามเราได้ที่</Title>
                            <div className="flex space-x-4 items-center">
                                <Youtube className="youtube-icon" href="https://youtube.com/@likqmusic" />
                                <a
                                    href="https://soundcloud.com/prod-lightz"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 p-2 transition-all rounded-full flex items-center justify-center bg-white text-primary hover:bg-primary-hover hover:text-white"
                                >
                                    <SoundCloud />
                                </a>
                                <Mailbox href="mailto:contact@likqmusic.com" className="mailbox-icon" />
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="footer-form bg-white/5 p-6 md:p-8 rounded-2xl backdrop-blur-sm">
                        <Title level={4} className="text-white mb-6 text-xl">กรอกข้อมูลให้เราติดต่อกลับ</Title>
                        <form className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="ชื่อ-นามสกุล"
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors"
                            />
                            <input
                                type="tel"
                                name="tel"
                                id="tel"
                                placeholder="เบอร์โทรศัพท์"
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors"
                            />
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="อีเมล"
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors"
                            />
                            <textarea
                                name="message"
                                id="message"
                                placeholder="ข้อความ"
                                rows={4}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors resize-none"
                            ></textarea>
                            <button
                                type="submit"
                                className="w-full bg-white text-[#153051] font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                ส่งข้อความ
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/10 text-center">
                    <p id="copyright" className="text-white/60 text-sm">
                        &copy; 2024 LiKQ Music Production. สงวนลิขสิทธิ์.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
