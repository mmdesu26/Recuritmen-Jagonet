import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function PATCH(req: Request) {
  try {
    const { email, oldPassword, newPassword } = await req.json()

    // Cek input
    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Semua kolom wajib diisi' },
        { status: 400 }
      )
    }

    // Cari admin berdasarkan email
    const admin = await prisma.admin.findUnique({
      where: { email },
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Email tidak terdaftar' },
        { status: 404 }
      )
    }

    // Verifikasi password lama
    const valid = await bcrypt.compare(oldPassword, admin.password)
    if (!valid) {
      return NextResponse.json(
        { error: 'Password lama salah' },
        { status: 400 }
      )
    }

    // Hash password baru
    const hashed = await bcrypt.hash(newPassword, 10)

    // Update password (email tetap sama)
    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: hashed },
    })

    return NextResponse.json({
      success: true,
      message: 'Perubahan berhasil disimpan. Silakan login ulang.',
    })
  } catch (error) {
    console.error('🔥 ERROR PATCH /api/admin/account:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
