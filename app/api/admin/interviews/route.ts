import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendInterviewEmail } from '@/lib/email'
import { sendInterviewWhatsApp } from '@/lib/whatsapp'

export async function POST(request: NextRequest) {
  try {
    const { applicationId, scheduledDate, location, notes } = await request.json()

    if (!applicationId || !scheduledDate || !location) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi' },
        { status: 400 }
      )
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { position: true },
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Lamaran tidak ditemukan' },
        { status: 404 }
      )
    }

    // Create or update interview schedule
    const interview = await prisma.interview.upsert({
      where: { applicationId },
      update: {
        scheduledDate: new Date(scheduledDate),
        location,
        notes: notes || null,
      },
      create: {
        applicationId,
        scheduledDate: new Date(scheduledDate),
        location,
        notes: notes || null,
      },
    })

    // Update application status
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'INTERVIEW_SCHEDULED' },
    })

    // NOTE: Email & WhatsApp API disabled - menggunakan Direct WhatsApp dari dashboard
    // yang lebih flexible dan tidak perlu API key
    
    // Send notifications (DISABLED - using direct WhatsApp instead)
    // try {
    //   await sendInterviewEmail(
    //     application.email,
    //     application.fullName,
    //     application.position.title,
    //     new Date(scheduledDate),
    //     location
    //   )
    // } catch (error) {
    //   console.error('Error sending email:', error)
    // }

    // try {
    //   await sendInterviewWhatsApp(
    //     application.whatsapp,
    //     application.fullName,
    //     application.position.title,
    //     new Date(scheduledDate),
    //     location
    //   )
    // } catch (error) {
    //   console.error('Error sending WhatsApp:', error)
    // }

    return NextResponse.json({
      message: 'Jadwal interview berhasil dibuat',
      interview,
    })
  } catch (error) {
    console.error('Error scheduling interview:', error)
    return NextResponse.json(
      { error: 'Gagal membuat jadwal interview' },
      { status: 500 }
    )
  }
}
