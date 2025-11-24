import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function sendInterviewEmail(
  to: string,
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

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: `Undangan Interview - ${position} | PT Sarana Media Cemerlang (Jagonet)`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>PT Sarana Media Cemerlang</h1>
            <p style="margin: 0; font-size: 18px;">JAGONET</p>
          </div>
          <div class="content">
            <p>Kepada Yth,<br><strong>${candidateName}</strong></p>
            
            <p>Terima kasih atas minat Anda untuk bergabung dengan PT Sarana Media Cemerlang (Jagonet). Kami dengan senang hati mengundang Anda untuk mengikuti sesi interview untuk posisi <strong>${position}</strong>.</p>
            
            <div class="info-box">
              <h3 style="margin-top: 0; color: #667eea;">Detail Interview</h3>
              <p><strong>Posisi:</strong> ${position}</p>
              <p><strong>Tanggal & Waktu:</strong> ${formattedDate}</p>
              <p><strong>Lokasi:</strong> ${location}</p>
            </div>
            
            <p>Mohon untuk hadir tepat waktu dan membawa:</p>
            <ul>
              <li>CV / Resume</li>
              <li>Fotocopy KTP</li>
              <li>Fotocopy Ijazah terakhir</li>
              <li>Pas foto terbaru</li>
            </ul>
            
            <p>Jika ada pertanyaan atau Anda tidak dapat hadir sesuai jadwal, mohon hubungi kami segera.</p>
            
            <p>Kami tunggu kehadiran Anda!</p>
            
            <p>Hormat kami,<br><strong>Tim HRD PT Sarana Media Cemerlang</strong></p>
          </div>
          <div class="footer">
            <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

export async function sendAcceptanceEmail(
  to: string,
  candidateName: string,
  position: string
) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: `Selamat! Anda Diterima - ${position} | PT Sarana Media Cemerlang (Jagonet)`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .success-box { background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Selamat!</h1>
          </div>
          <div class="content">
            <p>Kepada Yth,<br><strong>${candidateName}</strong></p>
            
            <div class="success-box">
              <h3 style="margin-top: 0; color: #059669;">Anda Diterima!</h3>
              <p>Selamat! Anda telah diterima untuk posisi <strong>${position}</strong> di PT Sarana Media Cemerlang (Jagonet).</p>
            </div>
            
            <p>Tim HRD kami akan menghubungi Anda segera untuk proses selanjutnya.</p>
            
            <p>Selamat bergabung dengan keluarga besar Jagonet!</p>
            
            <p>Hormat kami,<br><strong>Tim HRD PT Sarana Media Cemerlang</strong></p>
          </div>
        </div>
      </body>
      </html>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

export async function sendRejectionEmail(
  to: string,
  candidateName: string,
  position: string
) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: `Pemberitahuan Hasil Seleksi - ${position} | PT Sarana Media Cemerlang`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>PT Sarana Media Cemerlang</h1>
          </div>
          <div class="content">
            <p>Kepada Yth,<br><strong>${candidateName}</strong></p>
            
            <p>Terima kasih atas waktu dan minat Anda untuk melamar posisi <strong>${position}</strong> di PT Sarana Media Cemerlang (Jagonet).</p>
            
            <p>Setelah melalui proses seleksi yang cermat, kami menyesal untuk memberitahukan bahwa untuk saat ini kami belum dapat melanjutkan lamaran Anda.</p>
            
            <p>Kami sangat menghargai usaha Anda dan berharap Anda tetap tertarik dengan peluang lain di masa mendatang.</p>
            
            <p>Semoga sukses untuk karir Anda selanjutnya!</p>
            
            <p>Hormat kami,<br><strong>Tim HRD PT Sarana Media Cemerlang</strong></p>
          </div>
        </div>
      </body>
      </html>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}
