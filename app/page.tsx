'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Briefcase, Users, TrendingUp, MessageCircle, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Position {
  id: string
  title: string
  description: string
  location: string
  type: string
}

export default function Home() {
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    fetch('/api/positions/open')
      .then(res => res.json())
      .then(data => {
        setPositions(data.positions || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const whatsappHRD = process.env.NEXT_PUBLIC_WHATSAPP_HRD || '6282164841110'
  const whatsappLink = `https://wa.me/${whatsappHRD}`

  const navLinks = [
    { name: 'Beranda', href: '#hero' },
    { name: 'Tentang', href: '#about' },
    { name: 'Visi & Misi', href: '#vision' },
    { name: 'Galeri', href: '#gallery' },
    { name: 'Cara Mendaftar', href: '#how-to-apply' },
    { name: 'Lowongan', href: '#positions' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-white shadow-md group-hover:shadow-lg transition-all duration-300 flex items-center justify-center overflow-hidden">
                <img 
                  src="/logo.jpg" 
                  alt="Jagonet" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-slate-900">PT Sarana Media Cemerlang</div>
                <div className="text-xs font-bold text-slate-700">JAGONET</div>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200 relative group"
                  onClick={(e) => {
                    e.preventDefault()
                    const element = document.querySelector(link.href)
                    element?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
              <Button
                size="sm"
                className="bg-slate-900 hover:bg-slate-800 text-white"
                asChild
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Hubungi HRD
                </a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-slate-900" />
              ) : (
                <Menu className="h-6 w-6 text-slate-900" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-slate-200 bg-white"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                    onClick={(e) => {
                      e.preventDefault()
                      const element = document.querySelector(link.href)
                      element?.scrollIntoView({ behavior: 'smooth' })
                      setMobileMenuOpen(false)
                    }}
                  >
                    {link.name}
                  </a>
                ))}
                <Button
                  size="sm"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white mt-2"
                  asChild
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Hubungi HRD
                  </a>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer for fixed navbar */}
      <div className="h-20" />

      {/* Floating WhatsApp Button */}
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="h-8 w-8" />
        <motion.div
          className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </motion.a>

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden bg-slate-100">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100" />
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Company Logo */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-8 flex justify-center"
            >
              <div className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-3xl bg-white shadow-2xl p-4 flex items-center justify-center">
                <img 
                  src="/logo.jpg" 
                  alt="PT Sarana Media Cemerlang - Jagonet Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="mb-8"
            >
              <span className="inline-block bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                We're Hiring!
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-slate-900 leading-tight"
            >
              PT Sarana Media Cemerlang
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-slate-700"
            >
              JAGONET
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed px-4"
            >
              Bergabunglah dengan tim profesional kami dan kembangkan karir Anda bersama salah satu perusahaan telekomunikasi terkemuka di Indonesia
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-slate-900 hover:bg-slate-800 text-white"
                asChild
              >
                <Link href="#positions">
                  Lihat Lowongan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2 border-slate-300 hover:bg-slate-50"
                asChild
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Hubungi HRD
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-72 h-72 bg-slate-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </section>

      {/* About Company Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800">
              Tentang Kami
            </h2>
            <div className="w-24 h-1 bg-slate-900 mx-auto mb-8" />
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
                PT. SARANA MEDIA CEMERLANG
              </h3>
              <p className="text-lg md:text-xl text-slate-700 leading-relaxed mb-6">
                Hadir untuk menyediakan koneksi internet yang berkualitas guna membantu memenuhi kebutuhan Anda.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6 text-base md:text-lg text-slate-600 leading-relaxed"
            >
              <p>
                Sebuah perusahaan <span className="font-semibold text-slate-800">Managed Service Provider</span> dengan kapasitas layanan informasi dan teknologi yang sepenuhnya dapat disesuaikan dengan kebutuhan pelanggan. Hadir guna menjawab berbagai macam kebutuhan informasi dan teknologi yang tidak pernah berhenti berkembang.
              </p>
              <p>
                Sebagai sebuah perusahaan Managed Service Provider, menawarkan layanan penyediaan serta pengelolaan sumber daya informasi dan teknologi baik berupa perangkat lunak dan perangkat keras (software and hardware), beserta sumber daya manusia yang dibutuhkan ataupun dimiliki oleh pelanggan.
              </p>
              <p>
                PT Sarana Media Cemerlang memberikan koneksi 24 jam ke Global Internet dengan alokasi bandwidth dedicated (1:1) untuk memastikan performa jaringan selalu dalam keadaan terbaik setiap waktu. Dengan menggunakan jaringan berbasiskan wireless dan fiber optic, semua pengguna dapat berbagi koneksi dengan kecepatan tinggi.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section id="vision" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Visi */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-2 border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
                  <CardHeader className="space-y-4 pb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-slate-900">VISI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-base lg:text-lg text-slate-600 leading-relaxed">
                        Menjadi pilihan pertama Internet Service Provider yang dipercaya untuk Customer (ISP yang Terpercaya).
                      </p>
                      <p className="text-base lg:text-lg text-slate-600 leading-relaxed">
                        Menjadi Salah Satu Perusahaan Teknologi Informasi yang terpercaya dalam komitmen memberikan solusi dan service yang memuaskan dengan jaminan kualitas kepada para pelanggan.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Misi */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-2 border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
                  <CardHeader className="space-y-4 pb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-slate-900">MISI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-base lg:text-lg text-slate-600 leading-relaxed font-semibold">
                        LAYANAN, KEPERCAYAAN, KOMITMEN
                      </p>
                      <p className="text-base lg:text-lg text-slate-600 leading-relaxed">
                        Penyediaan layanan internet, Solusi jaringan terpadu, perangkat komputer aman di Wilayah Kabupaten Magetan dan Kabupaten Madiun.
                      </p>
                      <p className="text-base lg:text-lg text-slate-600 leading-relaxed">
                        Melalui berbagai layanan Internet yang berfokus pada hubungan erat antara masyarakat dan pelanggan dengan dunia luar sehingga tercipta hubungan yang harmonis dengan kami.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

{/* Gallery Section */}
<section id="gallery" className="py-20 bg-white">
  <div className="container mx-auto px-4">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800">
        Galeri Perusahaan
      </h2>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto">
        Kenali lebih dekat lingkungan kerja kami
      </p>
    </motion.div>

    <div className="max-w-6xl mx-auto">
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          "/images/foto1.jpg",
          "/images/foto2.jpg",
          "/images/foto3.jpg",
          "/images/foto4.jpg",
          "/images/foto5.jpg",
          "/images/foto6.jpg",
        ].map((imgSrc, index) => (
          <motion.div
            key={imgSrc}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer"
          >
            <Card className="overflow-hidden border-2 border-slate-200 hover:border-slate-400 transition-all duration-300 shadow-lg hover:shadow-2xl">
              <CardContent className="p-0">
                <img
                  src={imgSrc}
                  alt={`Galeri ${index + 1}`}
                  className="aspect-video object-cover w-full h-full"
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* How to Apply Section */}
      <section id="how-to-apply" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800">
              Cara Mendaftar
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Ikuti langkah-langkah mudah untuk memulai karir Anda bersama kami
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: 1,
                  title: 'Pilih Posisi',
                  description: 'Lihat daftar lowongan yang tersedia di bawah dan pilih posisi yang sesuai dengan keahlian dan minat Anda. Pastikan Anda memenuhi kualifikasi yang dibutuhkan.',
                  icon: Briefcase,
                },
                {
                  step: 2,
                  title: 'Isi Formulir',
                  description: 'Klik tombol "Lamar Sekarang" dan lengkapi formulir pendaftaran dengan data diri yang akurat. Upload CV, foto, dan dokumen pendukung lainnya sesuai persyaratan.',
                  icon: Users,
                },
                {
                  step: 3,
                  title: 'Seleksi & Interview',
                  description: 'Tim HRD kami akan meninjau CV Anda. Kandidat terpilih akan dihubungi melalui email atau WhatsApp untuk proses seleksi dan interview lebih lanjut.',
                  icon: MessageCircle,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-2 border-slate-200 hover:border-slate-400 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden">
                    <CardContent className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Step Number */}
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg">
                            <span className="text-3xl font-bold text-white">{item.step}</span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-grow">
                          <div className="flex items-start gap-4 mb-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                              <item.icon className="h-6 w-6 text-slate-700" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-slate-900 mb-2">{item.title}</h3>
                              <p className="text-base lg:text-lg text-slate-600 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Warning Box */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <Card className="border-2 border-orange-300 bg-orange-50">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center">
                        <span className="text-2xl">⚠️</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-orange-900 mb-2">WASPADA PENIPUAN</h4>
                      <p className="text-sm md:text-base text-orange-800 leading-relaxed">
                        PT Sarana Media Cemerlang <span className="font-bold">TIDAK PERNAH</span> memungut biaya apapun dalam proses rekrutmen. Hati-hati terhadap oknum yang mengatasnamakan perusahaan kami untuk meminta pembayaran.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800">
              Mengapa Bergabung dengan Kami?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Kami menawarkan lingkungan kerja yang mendukung pertumbuhan profesional Anda
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Briefcase,
                title: 'Karir Cemerlang',
                description: 'Kesempatan pengembangan karir yang jelas dengan program training berkelanjutan',
                color: 'from-slate-700 to-slate-800',
              },
              {
                icon: Users,
                title: 'Tim Solid',
                description: 'Bekerja dengan tim profesional yang suportif dan kolaboratif',
                color: 'from-slate-600 to-slate-700',
              },
              {
                icon: TrendingUp,
                title: 'Benefit Menarik',
                description: 'Kompensasi kompetitif dengan berbagai benefit dan fasilitas',
                color: 'from-slate-800 to-slate-900',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="h-full"
              >
                <Card className="border-2 border-slate-200 hover:border-slate-400 hover:shadow-2xl transition-all duration-300 h-full bg-white overflow-hidden">
                  <CardHeader className="space-y-4">
                    <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center shadow-lg`}>
                      <item.icon className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl lg:text-2xl font-bold text-slate-900">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base lg:text-lg text-slate-600 leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="positions" className="py-20 bg-slate-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800">
              Posisi yang Tersedia
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Temukan posisi yang sesuai dengan keahlian dan minat Anda
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse h-full border-2 border-slate-200">
                  <CardHeader className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="h-6 bg-slate-200 rounded-full w-20" />
                      <div className="h-10 w-10 rounded-full bg-slate-200" />
                    </div>
                    <div className="h-7 bg-slate-200 rounded w-3/4" />
                    <div className="h-5 bg-slate-200 rounded w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-2 pb-6">
                    <div className="h-4 bg-slate-200 rounded" />
                    <div className="h-4 bg-slate-200 rounded w-5/6" />
                    <div className="h-4 bg-slate-200 rounded w-4/5" />
                  </CardContent>
                  <div className="px-6 pb-6">
                    <div className="h-12 bg-slate-200 rounded-lg w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : positions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <Briefcase className="h-20 w-20 mx-auto text-slate-300 mb-4" />
              <p className="text-xl text-slate-600">
                Belum ada posisi yang dibuka saat ini. Silakan cek kembali nanti.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
              {positions.map((position, index) => (
                <motion.div
                  key={position.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="h-full"
                >
                  <Card className="border-2 border-slate-200 hover:border-slate-400 hover:shadow-2xl transition-all duration-300 h-full flex flex-col overflow-hidden bg-white">
                    <CardHeader className="space-y-3 pb-4">
                      <div className="flex justify-between items-start gap-2">
                        <Badge variant="secondary" className="text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800">
                          {position.type}
                        </Badge>
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="h-5 w-5 text-slate-700" />
                        </div>
                      </div>
                      <CardTitle className="text-xl lg:text-2xl font-bold text-slate-900 leading-tight">
                        {position.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-base text-slate-600">
                        <span className="text-lg">📍</span> 
                        <span className="font-medium">{position.location}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow pb-6">
                      <p className="text-sm lg:text-base text-slate-600 leading-relaxed line-clamp-3">
                        {position.description}
                      </p>
                    </CardContent>
                    <div className="px-6 pb-6 mt-auto">
                      <Button
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        asChild
                      >
                        <Link href={`/apply/${position.id}`}>
                          Lamar Sekarang
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
<footer className="bg-slate-900 text-white py-12">
  <div className="container mx-auto px-4 text-center space-y-4">
    {/* Nama perusahaan */}
    <h3 className="text-2xl font-bold mb-1">PT Sarana Media Cemerlang</h3>
    <p className="text-slate-400 text-sm">Jagonet</p>

    {/* Alamat */}
    <div className="mt-4">
      <p className="text-slate-300 text-sm mb-3">
        Ds. Madigondo RT. 16/05, Gambiran, Madigondo, Kec. Takeran, Kabupaten Magetan, Jawa Timur 63383
      </p>

      {/* Google Maps embed (REAL MAP, titik baru) */}
      <div className="flex justify-center">
        <iframe
          title="PT Sarana Media Cemerlang | Jagonet"
          src="https://www.google.com/maps/embed?pb=!4v1731069600000!6m8!1m7!1sCAoSLEFGMVFpcE5iUWhJUm5mS3lPNDNrU3h0NThjZllUejFyNHdCdG9BbGloOV9w!2m2!1d-7.6622238!2d111.4896555!3f142.98!4f1.43!5f0.7820865974627469"
          width="50%"
          height="350"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-lg shadow-lg"
        ></iframe>
      </div>

      <p className="text-xs text-slate-500 mt-1">
        Lihat lokasi di Google Maps:{" "}
        <a
          href="https://www.google.com/maps/place/PT.+Sarana+Media+Cemerlang+%7C+Jagonet/@-7.6623265,111.4895619,58m/data=!3m1!1e3!4m6!3m5!1s0x2e79bde4f8e7929b:0x2321948272b52818!8m2!3d-7.6622238!4d111.4896555!16s%2Fg%2F11rggpg35s?entry=ttu"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          Buka di Google Maps
        </a>
      </p>
    </div>

    {/* Company Profile */}
    <div className="mt-6">
      <a
        href="https://www.jagonet.co.id/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 underline transition"
      >
        Lihat Company Profile Jagonet
      </a>
    </div>

    {/* Copyright */}
    <p className="text-sm text-slate-500 mt-6">
      © {new Date().getFullYear()} PT Sarana Media Cemerlang. All rights reserved.
    </p>
  </div>
</footer>
    </div>
  );
}
