"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Upload, Loader2, CheckCircle, Briefcase, AlertCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Alert from "@/components/ui/alert"
import { toast } from "sonner"

interface Position {
  id: string
  title: string
  description: string
  location: string
  type: string
}

export default function ApplyPage() {
  const params = useParams()
  const router = useRouter()
  const [position, setPosition] = useState<Position | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [photo3x4File, setPhoto3x4File] = useState<File | null>(null) // Add state for 3x4 photo
  const [ktpFile, setKtpFile] = useState<File | null>(null) // Add state for KTP
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const refs = {
    nik: useRef<HTMLDivElement>(null),
    fullName: useRef<HTMLDivElement>(null),
    email: useRef<HTMLDivElement>(null),
    phone: useRef<HTMLDivElement>(null),
    whatsapp: useRef<HTMLDivElement>(null),
    address: useRef<HTMLDivElement>(null),
    education: useRef<HTMLDivElement>(null),
    cv: useRef<HTMLDivElement>(null),
    photo3x4: useRef<HTMLDivElement>(null), // Add ref for photo
    ktp: useRef<HTMLDivElement>(null), // Add ref for KTP
  }

  const [formData, setFormData] = useState({
    nik: "",
    fullName: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    education: "",
  })

  useEffect(() => {
    fetch("/api/positions/open")
      .then((res) => res.json())
      .then((data) => {
        const foundPosition = data.positions?.find((p: Position) => p.id === params.id)
        setPosition(foundPosition || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrors({})

    const { nik, fullName, email, phone, whatsapp, address, education } = formData
    const newErrors: { [key: string]: string } = {}

    if (!nik) newErrors.nik = "NIK wajib diisi"
    else if (nik.length !== 16 || !/^\d+$/.test(nik)) newErrors.nik = "NIK harus terdiri dari 16 digit angka"

    if (!fullName) newErrors.fullName = "Nama lengkap wajib diisi"
    if (!email) newErrors.email = "Email wajib diisi"
    if (!phone) newErrors.phone = "Nomor telepon wajib diisi"
    if (!whatsapp) newErrors.whatsapp = "Nomor WhatsApp wajib diisi"
    if (!address) newErrors.address = "Alamat lengkap wajib diisi"
    if (!education) newErrors.education = "Pendidikan terakhir wajib dipilih"
    if (!cvFile) newErrors.cv = "Silakan upload CV Anda"
    if (!photo3x4File) newErrors.photo3x4 = "Silakan upload foto 3x4" // Add photo validation
    if (!ktpFile) newErrors.ktp = "Silakan upload KTP Anda" // Add KTP validation

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      const firstErrorField = Object.keys(newErrors)[0]
      refs[firstErrorField as keyof typeof refs]?.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      setSubmitting(false)
      return
    }

    const formDataToSend = new FormData()
    Object.entries(formData).forEach(([key, value]) => formDataToSend.append(key, value))
    formDataToSend.append("positionId", params.id as string)
    formDataToSend.append("cv", cvFile)
    formDataToSend.append("photo3x4", photo3x4File) // Add photo to form data
    formDataToSend.append("ktp", ktpFile) // Add KTP to form data

    try {
      const response = await fetch("/api/applications", { method: "POST", body: formDataToSend })
      const data = await response.json()

      if (!response.ok) {
        setErrors({ form: data.error || "Gagal mengirim lamaran" })
        setSubmitting(false)
        return
      }

      toast.success("Lamaran berhasil dikirim!")
      router.push("/")
    } catch (err) {
      console.error(err)
      setErrors({ form: "Terjadi kesalahan pada server" })
      setSubmitting(false)
    }
  }

  const handleCVFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, cv: "File harus berformat PDF" }))
      setCvFile(null)
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, cv: "Ukuran file maksimal 5MB" }))
      setCvFile(null)
      return
    }

    setCvFile(file)
    setErrors((prev) => ({ ...prev, cv: "" }))
  }

  const handlePhoto3x4Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setErrors((prev) => ({ ...prev, photo3x4: "File harus berformat JPG atau PNG" }))
      setPhoto3x4File(null)
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo3x4: "Ukuran file maksimal 2MB" }))
      setPhoto3x4File(null)
      return
    }

    setPhoto3x4File(file)
    setErrors((prev) => ({ ...prev, photo3x4: "" }))
  }

  const handleKTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!["application/pdf", "image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
  setErrors((prev) => ({ ...prev, ktp: "File KTP harus berformat PDF, JPG, atau PNG" }))
  setKtpFile(null)
  return
}
    if (file.size > 3 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, ktp: "Ukuran file maksimal 3MB" }))
      setKtpFile(null)
      return
    }

    setKtpFile(file)
    setErrors((prev) => ({ ...prev, ktp: "" }))
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    )

  if (!position)
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md border-2 border-slate-200 shadow-xl">
          <CardHeader className="text-center space-y-4 p-8">
            <div className="inline-flex h-16 w-16 rounded-full bg-red-100 items-center justify-center mx-auto">
              <span className="text-3xl">❌</span>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">Posisi Tidak Ditemukan</CardTitle>
            <CardDescription className="text-base text-slate-600">
              Posisi yang Anda cari tidak tersedia atau sudah ditutup
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <Button asChild className="w-full bg-slate-900 hover:bg-slate-800 py-6">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Beranda
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Button variant="ghost" asChild className="mb-6 hover:bg-slate-200">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Link>
          </Button>

          <Card className="border-2 border-slate-200 shadow-2xl overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-6 md:p-8 lg:p-10">
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex h-12 w-12 md:h-14 md:w-14 rounded-xl bg-slate-800 items-center justify-center flex-shrink-0">
                  <Briefcase className="h-6 w-6 md:h-7 md:w-7 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Lamar Posisi</CardTitle>
                  <CardDescription className="text-slate-200 text-base md:text-lg">
                    {position.title} • {position.location}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 md:p-8 lg:p-10 bg-white">
              <Alert
  show={true}
  type="info"
  message="Dokumen KTP wajib diupload harus jelas terbaca untuk verifikasi."
/>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* NIK */}
                <Field
                  ref={refs.nik}
                  id="nik"
                  label="NIK (Nomor Induk Kependudukan) *"
                  value={formData.nik}
                  error={errors.nik}
                  onChange={(value) => setFormData({ ...formData, nik: value })}
                  placeholder="3201234567890001"
                  maxLength={16}
                />

                {/* Nama Lengkap */}
                <Field
                  ref={refs.fullName}
                  id="fullName"
                  label="Nama Lengkap *"
                  value={formData.fullName}
                  error={errors.fullName}
                  onChange={(value) => setFormData({ ...formData, fullName: value })}
                  placeholder="John Doe"
                />

                {/* Email */}
                <Field
                  ref={refs.email}
                  id="email"
                  label="Email *"
                  value={formData.email}
                  error={errors.email}
                  onChange={(value) => setFormData({ ...formData, email: value })}
                  placeholder="john@example.com"
                  type="email"
                />

                {/* Phone */}
                <Field
                  ref={refs.phone}
                  id="phone"
                  label="Nomor Telepon *"
                  value={formData.phone}
                  error={errors.phone}
                  onChange={(value) => setFormData({ ...formData, phone: value })}
                  placeholder="08123456789"
                />

                {/* WhatsApp */}
                <Field
                  ref={refs.whatsapp}
                  id="whatsapp"
                  label="Nomor WhatsApp *"
                  value={formData.whatsapp}
                  error={errors.whatsapp}
                  onChange={(value) => setFormData({ ...formData, whatsapp: value })}
                  placeholder="628123456789"
                />

                {/* Address */}
                <Field
                  ref={refs.address}
                  id="address"
                  label="Alamat Lengkap *"
                  value={formData.address}
                  error={errors.address}
                  onChange={(value) => setFormData({ ...formData, address: value })}
                  placeholder="Jl. Contoh No. 123, Jakarta"
                  textarea
                />

                {/* Education */}
                <div ref={refs.education} className="space-y-2">
                  <Label htmlFor="education">Pendidikan Terakhir *</Label>
                  {errors.education && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm"
                    >
                      {errors.education}
                    </motion.div>
                  )}
                  <Select
                    value={formData.education}
                    onValueChange={(value) => setFormData({ ...formData, education: value })}
                  >
                    <SelectTrigger className="h-12 text-base border-2 focus:border-slate-900">
                      <SelectValue placeholder="Pilih pendidikan terakhir" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SMA/SMK">SMA/SMK</SelectItem>
                      <SelectItem value="D3">D3</SelectItem>
                      <SelectItem value="S1">S1</SelectItem>
                      <SelectItem value="S2">S2</SelectItem>
                      <SelectItem value="S3">S3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* CV */}
                <div ref={refs.cv} className="space-y-2">
                  <Label htmlFor="cv">Upload CV (PDF) *</Label>
                  {errors.cv && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm"
                    >
                      {errors.cv}
                    </motion.div>
                  )}
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 md:p-10 text-center hover:border-slate-500 hover:bg-slate-50 transition-all duration-300 cursor-pointer">
                    <input id="cv" type="file" accept=".pdf" onChange={handleCVFileChange} className="hidden" />
                    <label htmlFor="cv" className="cursor-pointer block">
                      <div className="inline-flex h-16 w-16 rounded-full bg-slate-100 items-center justify-center mb-4">
                        <Upload className="h-8 w-8 text-slate-600" />
                      </div>
                      <p className="text-base font-medium text-slate-700 mb-2">
                        {cvFile ? (
                          <span className="text-green-600 flex items-center justify-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            {cvFile.name}
                          </span>
                        ) : (
                          "Klik untuk upload CV"
                        )}
                      </p>
                      <p className="text-sm text-slate-500">PDF maksimal 5MB</p>
                    </label>
                  </div>
                </div>

                <div ref={refs.photo3x4} className="space-y-2">
                  <Label htmlFor="photo3x4">Upload Foto 3x4 (JPG/PNG) *</Label>
                  {errors.photo3x4 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm"
                    >
                      {errors.photo3x4}
                    </motion.div>
                  )}
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 md:p-10 text-center hover:border-slate-500 hover:bg-slate-50 transition-all duration-300 cursor-pointer">
                    <input
                      id="photo3x4"
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handlePhoto3x4Change}
                      className="hidden"
                    />
                    <label htmlFor="photo3x4" className="cursor-pointer block">
                      <div className="inline-flex h-16 w-16 rounded-full bg-slate-100 items-center justify-center mb-4">
                        <Upload className="h-8 w-8 text-slate-600" />
                      </div>
                      <p className="text-base font-medium text-slate-700 mb-2">
                        {photo3x4File ? (
                          <span className="text-green-600 flex items-center justify-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            {photo3x4File.name}
                          </span>
                        ) : (
                          "Klik untuk upload Foto 3x4"
                        )}
                      </p>
                      <p className="text-sm text-slate-500">JPG atau PNG maksimal 2MB</p>
                    </label>
                  </div>
                </div>

                <div ref={refs.ktp} className="space-y-2">
                  <Label htmlFor="ktp">Upload KTP (PDF) *</Label>
                  {errors.ktp && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm"
                    >
                      {errors.ktp}
                    </motion.div>
                  )}
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 md:p-10 text-center hover:border-slate-500 hover:bg-slate-50 transition-all duration-300 cursor-pointer">
                    <input
  id="ktp"
  type="file"
  accept=".pdf"
  onChange={handleKTPChange}
  className="hidden"
/>
 
 <label htmlFor="ktp" className="cursor-pointer block">
                      <div className="inline-flex h-16 w-16 rounded-full bg-slate-100 items-center justify-center mb-4">
                        <Upload className="h-8 w-8 text-slate-600" />
                      </div>
                      <p className="text-base font-medium text-slate-700 mb-2">
                        {ktpFile ? (
                          <span className="text-green-600 flex items-center justify-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            {ktpFile.name}
                          </span>
                        ) : (
                          "Klik untuk upload KTP"
                        )}
                      </p>
                      <p className="text-sm text-slate-500">PDF (scan KTP) maksimal 3MB</p>
                    </label>
                  </div>
                </div>

                {errors.form && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg"
                  >
                    {errors.form}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white text-base md:text-lg py-6 md:py-7 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Mengirim Lamaran...
                    </>
                  ) : (
                    <>
                      Kirim Lamaran
                      <CheckCircle className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

// Helper component untuk input field
interface FieldProps {
  ref: React.RefObject<HTMLDivElement>
  id: string
  label: string
  value: string
  error?: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  type?: string
  textarea?: boolean
}
const Field = ({
  ref,
  id,
  label,
  value,
  error,
  onChange,
  placeholder,
  maxLength,
  type = "text",
  textarea = false,
}: FieldProps) => (
  <div ref={ref} className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    {error && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm"
      >
        {error}
      </motion.div>
    )}
    {textarea ? (
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="text-base border-2 focus:border-slate-900 resize-none"
      />
    ) : (
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="h-12 text-base border-2 focus:border-slate-900"
      />
    )}
  </div>
)
