import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const position = await prisma.position.findUnique({
      where: { id },
    })

    if (!position) {
      return NextResponse.json({ error: "Posisi tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json({ position })
  } catch (error) {
    console.error("Error fetching position:", error)
    return NextResponse.json({ error: "Failed to fetch position" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { title, description, requirements, location, type, isOpen } = await request.json()

    const position = await prisma.position.update({
      where: { id },
      data: {
        title,
        description,
        requirements,
        location,
        type,
        isOpen,
      },
    })

    return NextResponse.json({
      message: "Posisi berhasil diupdate",
      position,
    })
  } catch (error) {
    console.error("Error updating position:", error)
    return NextResponse.json({ error: "Gagal mengupdate posisi" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.position.delete({
      where: { id },
    })

    return NextResponse.json({
      message: "Posisi berhasil dihapus",
    })
  } catch (error) {
    console.error("Error deleting position:", error)
    return NextResponse.json({ error: "Gagal menghapus posisi" }, { status: 500 })
  }
}
