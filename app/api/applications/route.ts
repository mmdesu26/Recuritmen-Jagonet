import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
const pdfParse = require("pdf-parse")

// ==================== NIK VALIDATION ====================

function validateNIKFormat(nik: string): { isValid: boolean; details: string } {
  if (!/^\d{16}$/.test(nik)) {
    return { isValid: false, details: "NIK harus terdiri dari 16 digit angka" }
  }
  return { isValid: true, details: "Format NIK valid" }
}

// ==================== MAIN HANDLER ====================

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const nik = formData.get("nik") as string
    const fullName = formData.get("fullName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const whatsapp = formData.get("whatsapp") as string
    const address = formData.get("address") as string
    const education = formData.get("education") as string
    const positionId = formData.get("positionId") as string
    const cv = formData.get("cv") as File
    const photo3x4 = formData.get("photo3x4") as File
    const ktp = formData.get("ktp") as File

    // ==================== VALIDASI WAJIB ====================
    if (
      !nik || !fullName || !email || !phone || !whatsapp || !address ||
      !education || !positionId || !cv || !photo3x4 || !ktp
    ) {
      return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 })
    }

    // ==================== VALIDASI NIK ====================
    const nikValidation = validateNIKFormat(nik)
    if (!nikValidation.isValid) {
      return NextResponse.json({ error: nikValidation.details }, { status: 400 })
    }

    // ==================== CEK LAMARAN AKTIF ====================
    const existingApp = await prisma.application.findFirst({
      where: {
        nik,
        status: { in: ["PENDING", "INTERVIEW_SCHEDULED", "INTERVIEWED", "ACCEPTED"] },
      },
      include: { position: true },
    })
    if (existingApp) {
      return NextResponse.json({
        error: `NIK ${nik} sudah memiliki lamaran aktif (${existingApp.status}) untuk posisi ${existingApp.position.title}`,
      }, { status: 400 })
    }

    // ==================== CEK POSISI ====================
    const position = await prisma.position.findUnique({ where: { id: positionId } })
    if (!position) return NextResponse.json({ error: "Posisi tidak ditemukan" }, { status: 404 })
    if (!position.isOpen) return NextResponse.json({ error: "Posisi sudah ditutup" }, { status: 400 })

    // ==================== VALIDASI CV ====================
    if (cv.type !== "application/pdf") {
      return NextResponse.json({ error: "File CV harus PDF" }, { status: 400 })
    }
    if (cv.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran CV maksimal 5MB" }, { status: 400 })
    }

    // ==================== VALIDASI FOTO ====================
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"]
    if (!allowedImageTypes.includes(photo3x4.type)) {
      return NextResponse.json({ error: "Foto 3x4 harus JPG atau PNG" }, { status: 400 })
    }
    if (photo3x4.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran foto 3x4 maksimal 2MB" }, { status: 400 })
    }

    // ==================== VALIDASI KTP (TANPA VERIFIKASI ISI) ====================
    const allowedKtpTypes = ["application/pdf", ...allowedImageTypes]
    if (!allowedKtpTypes.includes(ktp.type)) {
      return NextResponse.json({ error: "File KTP harus PDF, JPG, atau PNG" }, { status: 400 })
    }
    if (ktp.size > 3 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran file KTP maksimal 3MB" }, { status: 400 })
    }

    // Tidak ada pemeriksaan isi PDF KTP
    const ktpValidation = {
      isValid: true,
      confidence: 100,
      details: ["File KTP diterima tanpa verifikasi isi dokumen"],
    }

    // ==================== SIMPAN FILE ====================
    const timestamp = Date.now()
    const sanitizedNik = nik.replace(/[^a-zA-Z0-9]/g, "_")

    const saveFile = async (dir: string, filename: string, file: File) => {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      if (!existsSync(dir)) await mkdir(dir, { recursive: true })
      await writeFile(join(dir, filename), buffer)
    }

    const cvDir = join(process.cwd(), "public", "uploads", "cv")
    const photoDir = join(process.cwd(), "public", "uploads", "photos")
    const ktpDir = join(process.cwd(), "public", "uploads", "ktp")

    const cvFilename = `${sanitizedNik}_${timestamp}.pdf`
    const photoExt = photo3x4.type.split("/")[1]
    const photoFilename = `${sanitizedNik}_3x4_${timestamp}.${photoExt}`
    const ktpExt = ktp.type.split("/")[1] || "pdf"
    const ktpFilename = `${sanitizedNik}_ktp_${timestamp}.${ktpExt}`

    await Promise.all([
      saveFile(cvDir, cvFilename, cv),
      saveFile(photoDir, photoFilename, photo3x4),
      saveFile(ktpDir, ktpFilename, ktp),
    ])

    const cvUrl = `/uploads/cv/${cvFilename}`
    const photo3x4Url = `/uploads/photos/${photoFilename}`
    const ktpUrl = `/uploads/ktp/${ktpFilename}`

    // ==================== SIMPAN DATA KE DATABASE ====================
    const application = await prisma.application.create({
      data: {
        nik,
        fullName,
        email,
        phone,
        whatsapp,
        address,
        education,
        positionId,
        cvUrl,
        photo3x4Url,
        ktpUrl,
        ktpVerified: ktpValidation.isValid,
        status: "PENDING",
      },
      include: { position: true },
    })

    return NextResponse.json({
      message: "Lamaran berhasil dikirim",
      application,
      ktpValidation,
    })
  } catch (error) {
    console.error("Error creating application:", error)
    return NextResponse.json(
      { error: "Gagal mengirim lamaran. Silakan coba lagi." },
      { status: 500 }
    )
  }
}
