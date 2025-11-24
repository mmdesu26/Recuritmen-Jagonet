'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'

export default function SettingsContent() {
  const router = useRouter()

  // ======== State ========
  const [email, setEmail] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [smtpUser, setSmtpUser] = useState('')
  const [smtpPass, setSmtpPass] = useState('')
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com')
  const [smtpPort, setSmtpPort] = useState('587')
  const [loading, setLoading] = useState(false)

  // State untuk lihat/sembunyikan password
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showSmtpPass, setShowSmtpPass] = useState(false)

  // ======== Handler untuk update akun admin ========
  const handleAccountUpdate = async () => {
    if (!email || !oldPassword || !newPassword) {
      toast.error('Semua kolom wajib diisi')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, oldPassword, newPassword }),
      })

      const data = await res.json()
      setLoading(false)

      // 🟥 Jika gagal (password salah, email tidak ada, dsb)
      if (!res.ok) {
        toast.error(data.error || 'Gagal memperbarui akun')
        return
      }

      // 🟩 Jika berhasil ubah password
      toast.success(data.message || 'Perubahan berhasil disimpan!')
      await new Promise((r) => setTimeout(r, 2000)) // Delay agar toast sempat tampil

      localStorage.removeItem('token')
      router.push('/admin/login')
    } catch (error) {
      console.error(error)
      setLoading(false)
      toast.error('Terjadi kesalahan koneksi ke server')
    }
  }

  // ======== UI ========
  return (
    <div className="p-6 space-y-8">
      {/* Pengaturan Akun */}
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Akun Admin</CardTitle>
          <CardDescription>Ubah email login dan password admin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Email baru"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password lama */}
          <div className="relative">
            <Input
              placeholder="Password lama"
              type={showOldPassword ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Password baru */}
          <div className="relative">
            <Input
              placeholder="Password baru"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button onClick={handleAccountUpdate} disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
