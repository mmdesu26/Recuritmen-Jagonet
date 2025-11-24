import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { applicationId, status } = await request.json()

    if (!applicationId || !status) {
      return NextResponse.json({ error: "Application ID dan status wajib diisi" }, { status: 400 })
    }

    const application = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
      include: {
        position: true,
      },
    })

    return NextResponse.json({
      message: "Status lamaran berhasil diperbarui",
      application,
    })
  } catch (error) {
    console.error("Error updating status:", error)
    return NextResponse.json({ error: "Gagal memperbarui status lamaran" }, { status: 500 })
  }
}
