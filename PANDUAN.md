# 🎯 PANDUAN SETUP & MENJALANKAN APLIKASI

## ✅ Yang Sudah Dibuat

### 1. **Landing Page Publik** (`/`)
- Hero section dengan animasi Framer Motion
- Daftar posisi pekerjaan yang sedang dibuka
- Tombol WhatsApp floating untuk kontak HRD langsung
- Fully responsive dan beranimasi

### 2. **Form Pendaftaran** (`/apply/[id]`)
- Form lengkap dengan validasi
- Upload CV (PDF, max 5MB)
- **Validasi NIK Cerdas:** 
  - 1 NIK = 1 lamaran AKTIF per waktu
  - NIK yang pernah ditolak BISA daftar lagi ✅
  - Mencegah duplikasi lamaran aktif
- Success screen setelah submit

### 3. **Dashboard Admin** (`/admin/dashboard`)
- Overview statistik real-time
- Manajemen kandidat dengan filter status
- CRUD posisi pekerjaan
- Jadwal interview dengan notifikasi
- View detail kandidat & download CV

### 4. **Database Schema** (Prisma + MySQL)
- Admin (HRD login)
- Position (Posisi pekerjaan)
- Application (Lamaran kandidat)
- Interview (Jadwal interview)

### 5. **API Routes**
- `/api/positions/open` - Daftar posisi terbuka
- `/api/applications` - Submit lamaran
- `/api/admin/*` - Admin APIs (CRUD)
- `/api/auth/login` - Login admin

### 6. **Utilities**
- Email service (Nodemailer)
- WhatsApp service (Fonnte API)
- File upload handler
- Date formatting

---

## 🚀 CARA MENJALANKAN

### Step 1: Install Dependencies

# Install packages
npm install

# Install missing dependencies
npm install tsx @radix-ui/react-tabs
\`\`\`

### Step 2: Setup Database MySQL

Buka MySQL dan jalankan:

\`\`\`sql
CREATE DATABASE jagonet_recruitment;
\`\`\`

### Step 3: Konfigurasi Environment

File `.env` sudah dibuat. Edit sesuai kebutuhan:

\`\`\`env
# Database - Sesuaikan username & password MySQL Anda
DATABASE_URL="mysql://root:your_password@localhost:3306/jagonet_recruitment"

# Email - Gunakan Gmail atau SMTP lain
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"

# WhatsApp - Daftar di https://fonnte.com untuk token
WHATSAPP_API_TOKEN="your-fonnte-token"
NEXT_PUBLIC_WHATSAPP_HRD="62881036932090"  # Nomor WA HRD
\`\`\`

**Cara dapatkan Gmail App Password:**
1. Aktifkan 2-Factor Authentication di Google Account
2. Buka https://myaccount.google.com/apppasswords
3. Generate password untuk "Mail"
4. Copy paste ke `.env`

**Cara dapatkan Fonnte Token:**
1. Daftar di https://fonnte.com
2. Beli paket atau gunakan trial
3. Copy token dari dashboard
4. Paste ke `.env`

### Step 4: Generate Prisma & Migrate Database

\`\`\`powershell
# Generate Prisma Client
npx prisma generate

# Run migrations (buat tabel di database)
npx prisma migrate dev --name init

# Seed data (buat admin default & sample positions)
npx prisma db seed
\`\`\`

Jika error "tsx not found", install dulu:
\`\`\`powershell
npm install -D tsx
npx prisma db seed
\`\`\`

### Step 5: Install ShadCN Components

\`\`\`powershell
# Install komponen yang masih missing
npx shadcn@latest add tabs
\`\`\`

### Step 6: Jalankan Development Server

\`\`\`powershell
npm run dev
\`\`\`

Buka browser:
- **Landing Page**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login

---

## 👤 DEFAULT LOGIN ADMIN

\`\`\`
Email: admin@jagonet.com
Password: admin123
\`\`\`

⚠️ **PENTING**: Ganti password setelah login pertama!

---

## 📋 CHECKLIST TESTING

### Test Landing Page
- [ ] Buka http://localhost:3000
- [ ] Lihat animasi berjalan smooth
- [ ] Klik tombol WA floating
- [ ] Scroll ke section "Posisi yang Tersedia"
- [ ] Lihat 4 sample positions muncul

### Test Form Pendaftaran
- [ ] Klik "Lamar Sekarang" di salah satu posisi
- [ ] Isi semua field
- [ ] Upload CV (PDF)
- [ ] Submit form
- [ ] Lihat success message
- [ ] Coba submit lagi dengan NIK yang sama → Error

### Test Dashboard Admin
- [ ] Login di /admin/login
- [ ] Lihat statistik di Overview tab
- [ ] Buka tab Kandidat
- [ ] Filter berdasarkan status
- [ ] View detail kandidat
- [ ] Download CV kandidat
- [ ] Jadwalkan interview → notifikasi terkirim
- [ ] Update status → Terima/Tolak
- [ ] Buka tab Posisi
- [ ] Tambah posisi baru
- [ ] Edit posisi
- [ ] Hapus posisi

---

## 🔧 TROUBLESHOOTING

### Error: Cannot connect to database
**Solusi:**
\`\`\`powershell
# Cek MySQL service running
# Di Windows: buka Services.msc, cari MySQL, Start

# Test connection
npx prisma db push
\`\`\`

### Error: Module not found '@/components/ui/tabs'
**Solusi:**
\`\`\`powershell
npx shadcn@latest add tabs
\`\`\`

### Error: Prisma Client not found
**Solusi:**
\`\`\`powershell
npx prisma generate
\`\`\`

### Email tidak terkirim
**Solusi:**
- Pastikan EMAIL_USER dan EMAIL_PASSWORD benar
- Gunakan App Password, bukan password Gmail biasa
- Cek spam folder

### WhatsApp tidak terkirim
**Solusi:**
- Pastikan WHATSAPP_API_TOKEN valid
- Cek format nomor: 628xxx (dengan kode negara, tanpa +)
- Cek quota/saldo di Fonnte

### File upload error
**Solusi:**
- Pastikan folder `public/uploads/cv` ada
- Windows: buat manual atau restart dev server

---

## 📂 STRUKTUR FILE PENTING

\`\`\`
app/
├── page.tsx                    # Landing page
├── apply/[id]/page.tsx        # Form pendaftaran
├── admin/
│   ├── login/page.tsx         # Login admin
│   └── dashboard/page.tsx     # Dashboard admin
└── api/
    ├── positions/open/        # API posisi publik
    ├── applications/          # API lamaran
    └── admin/                 # Admin APIs
        ├── positions/         # CRUD posisi
        ├── applications/      # Manage kandidat
        └── interviews/        # Jadwal interview

lib/
├── prisma.ts                  # Prisma client
├── email.ts                   # Email utilities
├── whatsapp.ts                # WhatsApp utilities
└── utils.ts                   # Helper functions

prisma/
├── schema.prisma              # Database schema
└── seed.ts                    # Seed data

.env                           # Environment variables
\`\`\`

---

## 🎨 KUSTOMISASI

### Ganti Warna Brand
Edit `app/globals.css`:
\`\`\`css
/* Cari bagian gradient dan ganti warna */
from-purple-600 to-blue-600
/* Ganti dengan warna brand Anda */
\`\`\`

### Tambah Logo
1. Taruh logo di `public/logo.png`
2. Update di `app/page.tsx` dan `app/admin/dashboard/page.tsx`

### Ubah Nama Perusahaan
Search & replace "PT Sarana Media Cemerlang" dan "Jagonet" di semua file.

---

## 🚀 DEPLOYMENT (Production)

### Option 1: Vercel (Recommended)

1. Push ke GitHub
2. Import project di vercel.com
3. Set environment variables
4. Deploy!

**Database Production:**
- PlanetScale (MySQL gratis)
- Railway.app
- Supabase

### Option 2: VPS

1. Setup server (Ubuntu/CentOS)
2. Install Node.js, MySQL, Nginx
3. Clone repo
4. Install dependencies
5. Run migrations
6. Start dengan PM2

---

## 📝 FITUR WORKFLOW

### Workflow Rekrutmen:

1. **Kandidat mendaftar** via form
   - Status: PENDING
   - CV tersimpan
   - Data masuk dashboard admin

2. **Admin review kandidat**
   - View detail lengkap
   - Download CV
   - Jadwalkan interview

3. **Status: INTERVIEW_SCHEDULED**
   - Email otomatis terkirim
   - WhatsApp otomatis terkirim
   - Detail jadwal tersimpan

4. **Setelah interview**
   - Admin update status:
     - INTERVIEWED (sudah interview)
     - ACCEPTED (diterima)
     - REJECTED (ditolak)

5. **Notifikasi final**
   - Email diterima/ditolak
   - WhatsApp diterima/ditolak

---

## � VALIDASI NIK - CARA KERJA

### **Aturan NIK:**
1. **1 NIK = 1 Lamaran AKTIF**
   - Kandidat hanya bisa punya 1 lamaran aktif dalam satu waktu
   - Status aktif: PENDING, INTERVIEW_SCHEDULED, INTERVIEWED, ACCEPTED

2. **NIK Bisa Daftar Lagi Setelah Ditolak** ✅
   - Jika lamaran ditolak (status: REJECTED), NIK bisa daftar lagi
   - Bisa lamar posisi yang sama atau posisi berbeda
   - Data lamaran lama tetap tersimpan untuk histori

### **Contoh Kasus:**

**Kasus 1: Lamaran Ditolak → Daftar Lagi ✅**
```
1. Budi (NIK: 123) lamar posisi Network Engineer
2. HRD tolak lamaran Budi (status: REJECTED)
3. Budi bisa daftar lagi dengan NIK yang sama (123)
4. Bisa lamar posisi yang sama atau berbeda
```

**Kasus 2: Lamaran Masih Proses → Tidak Bisa Daftar Lagi ❌**
```
1. Ani (NIK: 456) lamar posisi Web Developer
2. Status masih PENDING (belum diproses HRD)
3. Ani coba daftar lagi dengan NIK 456 → DITOLAK SISTEM
4. Error: "NIK sudah terdaftar untuk posisi Web Developer..."
```

**Kasus 3: Sudah Diterima → Tidak Bisa Daftar Lagi ❌**
```
1. Citra (NIK: 789) lamar dan DITERIMA
2. Status: ACCEPTED
3. Citra tidak bisa daftar lagi dengan NIK yang sama
```

### **Implementasi Teknis:**
```typescript
// Check ACTIVE applications only (not REJECTED)
const existingActiveApplication = await prisma.application.findFirst({
  where: { 
    nik,
    status: { not: 'REJECTED' }
  }
})
```

---

## �🔐 SECURITY NOTES

✅ **Sudah Diimplementasi:**
- **NIK validation cerdas** (1 NIK = 1 lamaran aktif, bisa daftar lagi setelah ditolak)
- File type validation (hanya PDF)
- File size limit (max 5MB)
- Basic admin authentication
- Direct WhatsApp integration (no API key needed)

⚠️ **Untuk Production:**
- Implementasi proper session (NextAuth.js)
- Rate limiting API
- HTTPS/SSL certificate
- Backup database regular
- Monitor error logs

---

## 📞 SUPPORT

Jika ada error atau pertanyaan, silakan hubungi developer.

**Happy Coding! 🚀**

---

**Dibuat untuk PT Sarana Media Cemerlang (Jagonet)**
