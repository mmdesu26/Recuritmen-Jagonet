import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@jagonet.com' },
    update: {},
    create: {
      email: 'admin@jagonet.com',
      password: hashedPassword,
      name: 'Admin Jagonet',
    },
  })

  console.log('✅ Admin created:', admin.email)

  // Create sample positions
  const positions = [
    {
      title: 'Network Engineer',
      description: 'Bertanggung jawab untuk merancang, mengimplementasikan, dan memelihara infrastruktur jaringan perusahaan.',
      requirements: '- Minimal S1 Teknik Informatika/Telekomunikasi\n- Pengalaman minimal 2 tahun di bidang networking\n- Menguasai routing dan switching\n- Sertifikasi CCNA/CCNP (nilai plus)',
      location: 'Jakarta',
      type: 'Full-time',
      isOpen: true,
    },
    {
      title: 'Technical Support',
      description: 'Memberikan dukungan teknis kepada pelanggan dan menyelesaikan masalah teknis yang dihadapi.',
      requirements: '- Minimal D3 Teknik Informatika\n- Pengalaman 1 tahun di bidang technical support\n- Komunikasi yang baik\n- Mampu bekerja dalam tim',
      location: 'Jakarta',
      type: 'Full-time',
      isOpen: true,
    },
    {
      title: 'Sales Marketing',
      description: 'Melakukan penjualan produk dan layanan Jagonet kepada calon pelanggan.',
      requirements: '- Minimal SMA/SMK\n- Pengalaman di bidang sales (nilai plus)\n- Memiliki kendaraan sendiri\n- Target oriented\n- Komunikasi persuasif',
      location: 'Jakarta, Bandung, Surabaya',
      type: 'Full-time',
      isOpen: true,
    },
    {
      title: 'Web Developer',
      description: 'Mengembangkan dan memelihara aplikasi web perusahaan.',
      requirements: '- Minimal S1 Teknik Informatika\n- Menguasai HTML, CSS, JavaScript\n- Pengalaman dengan React/Next.js\n- Familiar dengan REST API',
      location: 'Jakarta',
      type: 'Full-time',
      isOpen: true,
    },
  ]

  for (const positionData of positions) {
    const position = await prisma.position.create({
      data: positionData,
    })
    console.log('✅ Position created:', position.title)
  }

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
