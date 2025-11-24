import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const positions = await prisma.position.findMany({
      include: {
        _count: {
          select: { applications: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ positions })
  } catch (error) {
    console.error("Error fetching positions:", error)
    return NextResponse.json({ error: "Failed to fetch positions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, requirements, location, type, isOpen } = await request.json()

    if (!title || !description || !requirements || !location || !type) {
      return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 })
    }

    const position = await prisma.position.create({
      data: {
        title,
        description,
        requirements,
        location,
        type,
        isOpen: isOpen ?? true,
      },
    })

    return NextResponse.json({
      message: "Posisi berhasil dibuat",
      position,
    })
  } catch (error) {
    console.error("Error creating position:", error)
    return NextResponse.json({ error: "Gagal membuat posisi" }, { status: 500 })
  }
}
