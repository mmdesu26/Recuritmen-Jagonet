export async function sendWhatsAppMessage(
  phone: string,
  message: string
): Promise<{ success: boolean; error?: any }> {
  try {
    const response = await fetch(process.env.WHATSAPP_API_URL || '', {
      method: 'POST',
      headers: {
        'Authorization': process.env.WHATSAPP_API_TOKEN || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target: phone,
        message: message,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send WhatsApp message')
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending WhatsApp:', error)
    return { success: false, error }
  }
}

export async function sendInterviewWhatsApp(
  phone: string,
  candidateName: string,
  position: string,
  date: Date,
  location: string
) {
  const formattedDate = new Date(date).toLocaleString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const message = `
*UNDANGAN INTERVIEW*
PT Sarana Media Cemerlang (Jagonet)

Kepada Yth. ${candidateName},

Selamat! Anda diundang untuk mengikuti interview untuk posisi:

📋 *Posisi:* ${position}
📅 *Tanggal & Waktu:* ${formattedDate}
📍 *Lokasi:* ${location}

Mohon membawa:
- CV/Resume
- Fotocopy KTP
- Fotocopy Ijazah terakhir
- Pas foto terbaru

Konfirmasi kehadiran Anda dengan membalas pesan ini.

Terima kasih,
*Tim HRD Jagonet*
  `.trim()

  return sendWhatsAppMessage(phone, message)
}

export async function sendAcceptanceWhatsApp(
  phone: string,
  candidateName: string,
  position: string
) {
  const message = `
*SELAMAT! 🎉*
PT Sarana Media Cemerlang (Jagonet)

Kepada Yth. ${candidateName},

Selamat! Anda telah *DITERIMA* untuk posisi *${position}* di PT Sarana Media Cemerlang (Jagonet).

Tim HRD kami akan menghubungi Anda segera untuk proses selanjutnya.

Selamat bergabung dengan keluarga besar Jagonet!

*Tim HRD Jagonet*
  `.trim()

  return sendWhatsAppMessage(phone, message)
}

export async function sendRejectionWhatsApp(
  phone: string,
  candidateName: string,
  position: string
) {
  const message = `
PT Sarana Media Cemerlang (Jagonet)

Kepada Yth. ${candidateName},

Terima kasih atas minat Anda untuk melamar posisi ${position} di Jagonet.

Setelah melalui proses seleksi, untuk saat ini kami belum dapat melanjutkan lamaran Anda.

Semoga sukses untuk karir Anda selanjutnya!

Terima kasih,
*Tim HRD Jagonet*
  `.trim()

  return sendWhatsAppMessage(phone, message)
}
