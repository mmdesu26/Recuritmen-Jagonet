import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const positions = await prisma.position.findMany({
      where: {
        isOpen: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ positions })
  } catch (error) {
    console.error('Error fetching positions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch positions' },
      { status: 500 }
    )
  }
}
