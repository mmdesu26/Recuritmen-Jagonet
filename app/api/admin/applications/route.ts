import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")

    const where: any = {}
    if (status && status !== "ALL") {
      where.status = status
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        position: true,
        interviewSchedule: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const formatted = applications.map((app) => ({
      ...app,
      photo3x4Url: app.photo3x4Url ?? null,
      ktpUrl: app.ktpUrl ?? null,
      ktpVerified: app.ktpVerified ?? false,
    }))

    return NextResponse.json({ applications: formatted })
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}
