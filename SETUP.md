# 🚀 Sistem Rekrutmen PT Sarana Media Cemerlang (Jagonet)

Aplikasi web sistem rekrutmen modern dengan Next.js 15, TypeScript, Prisma, MySQL, dan ShadCN UI.

## ✨ Fitur Utama

### Untuk Calon Pelamar:
- 🏠 **Landing Page Modern** dengan animasi smooth dan responsif
- 📋 **Form Pendaftaran** dengan upload CV (PDF)
- 🔒 **Validasi NIK Unik** - satu NIK hanya bisa mendaftar sekali
- 📱 **Tombol WhatsApp Floating** untuk kontak langsung ke HRD
- 📧 **Notifikasi Email & WhatsApp** otomatis untuk jadwal interview

### Untuk Admin/HRD:
- 🎨 **Dashboard Modern** dengan UI yang indah dan responsif
- 📊 **Overview Statistik** real-time
- 👥 **Manajemen Kandidat** dengan berbagai status
- 💼 **CRUD Posisi Pekerjaan** lengkap
- 📅 **Jadwal Interview** dengan notifikasi otomatis
- 📱 **Integrasi WhatsApp & Email**
- 📥 **Download CV** kandidat

## 🛠️ Tech Stack

- Next.js 15 + TypeScript
- MySQL + Prisma ORM
- ShadCN UI + TailwindCSS
- Framer Motion
- Nodemailer + WhatsApp API

## 🚀 Quick Start

### 1. Install Dependencies
\`\`\`bash
npm install
npm install @prisma/client prisma bcryptjs @types/bcryptjs framer-motion date-fns react-hook-form zod @hookform/resolvers nodemailer @types/nodemailer lucide-react
\`\`\`

### 2. Setup Database
\`\`\`sql
CREATE DATABASE jagonet_recruitment;
\`\`\`

Edit `.env` sesuai konfigurasi database Anda.

### 3. Run Migrations
\`\`\`bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
\`\`\`

### 4. Start Development
\`\`\`bash
npm run dev
\`\`\`

## 👤 Default Login

\`\`\`
Email: admin@jagonet.com
Password: admin123
\`\`\`

## 📁 Important Files

- `/app/page.tsx` - Landing page publik
- `/app/apply/[id]/page.tsx` - Form pendaftaran
- `/app/admin/dashboard/page.tsx` - Dashboard admin
- `/prisma/schema.prisma` - Database schema
- `/lib/email.ts` - Email utilities
- `/lib/whatsapp.ts` - WhatsApp utilities

## 🔧 Configuration

Edit `.env` untuk konfigurasi:
- Database connection
- Email SMTP
- WhatsApp API (Fonnte)
- Upload settings

## 📊 Workflow

1. Pelamar daftar → Status: PENDING
2. Admin review → Jadwalkan Interview
3. Sistem kirim notifikasi → Email + WA
4. Setelah interview → Update status
5. Notifikasi final → Email + WA

---

**Made with ❤️ for PT Sarana Media Cemerlang**
