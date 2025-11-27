"use client"

import { useEffect, useState, useCallback, useMemo } from "react" // Tambahkan useCallback/useMemo untuk optimasi
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  LogOut,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Eye,
  Edit,
  Trash2,
  FileText,
  Download,
  MessageCircle,
  ImageIcon,
  Settings,
} from "lucide-react"

// Import Komponen UI (diurutkan berdasarkan komponen dasar/library)
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Import Komponen Lokal/Internal
import SettingsContent from './SettingsContent'

// ---
// ## 🛠️ Utility Functions
// ---

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ---
// ## 🔠 Simple Table Components (Dapat dipindahkan ke file komponen terpisah)
// ---

const Table = ({ children, className = "" }: any) => (
  <table className={`w-full border-collapse ${className}`}>{children}</table>
)

const TableHeader = ({ children }: any) => (
  <thead className="bg-slate-50">{children}</thead>
)

const TableBody = ({ children }: any) => <tbody>{children}</tbody>

const TableRow = ({ children, className = "" }: any) => (
  <tr className={`border-b border-slate-200 hover:bg-slate-50 ${className}`}>{children}</tr>
)

const TableHead = ({ children, className = "" }: any) => (
  <th className={`text-left p-4 font-semibold text-slate-700 ${className}`}>{children}</th>
)

const TableCell = ({ children, className = "" }: any) => (
  <td className={`p-4 ${className}`}>{children}</td>
)

// ---
// ## 📝 Interface Definitions
// ---

interface Admin {
  id: string
  email: string
  name: string
}

interface Position {
  id: string
  title: string
  description: string
  requirements: string
  location: string
  type: string
  isOpen: boolean
  createdAt: string
  _count?: {
    applications: number
  }
}

interface Application {
  id: string
  nik: string
  fullName: string
  email: string
  phone: string
  whatsapp: string
  address: string
  education: string
  cvUrl: string
  photo3x4Url: string | null
  ktpUrl: string | null
  ktpVerified: boolean
  status: string
  createdAt: string
  position: Position
  interviewSchedule?: {
    id: string
    scheduledDate: string
    location: string
    notes?: string
  }
}

// ---
// ## 📦 Main Component
// ---

export default function AdminDashboardPage() {
  // --- STATE MANAGEMENT ---
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [filterStatus, setFilterStatus] = useState("ALL")

  // Dialog states
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [interviewDialog, setInterviewDialog] = useState(false)
  const [positionDialog, setPositionDialog] = useState(false)
  const [editPosition, setEditPosition] = useState<Position | null>(null)
  const [viewDialog, setViewDialog] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState(false)
  const [documentDialog, setDocumentDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{ status: string; app: Application } | null>(null)

  // Form states
  const [interviewForm, setInterviewForm] = useState({
    scheduledDate: "",
    location: "",
    notes: "",
  })

  const [positionForm, setPositionForm] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    type: "Full-time",
    isOpen: true,
  })

  const [whatsappPreview, setWhatsappPreview] = useState("")

  // --- ASYNCHRONOUS FUNCTIONS (menggunakan useCallback) ---

  const fetchPositions = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/positions')
      const data = await response.json()
      setPositions(data.positions || [])
    } catch (error) {
      console.error("Error fetching positions:", error)
      setPositions([])
    }
  }, [])

  const fetchApplications = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/applications?status=${filterStatus}`)
      const data = await response.json()
      setApplications(data.applications || [])
    } catch (error) {
      console.error("Error fetching applications:", error)
      setApplications([])
    }
  }, [filterStatus])

  const fetchData = useCallback(async () => {
    try {
      await Promise.all([fetchApplications(), fetchPositions()])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      setLoading(false)
    }
  }, [fetchApplications, fetchPositions])

  const handleUpdateStatus = async (applicationId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/applications/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, status }),
      })

      if (response.ok) {
        fetchApplications()
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const handleScheduleInterview = async () => {
    if (!selectedApp) return

    try {
      const response = await fetch("/api/admin/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          ...interviewForm,
        }),
      })

      if (response.ok) {
        handleSendWhatsApp()
        setInterviewDialog(false)
        setInterviewForm({ scheduledDate: "", location: "", notes: "" })
        fetchApplications()
      }
    } catch (error) {
      console.error("Error scheduling interview:", error)
    }
  }

  const handleSavePosition = async () => {
    try {
      const url = editPosition ? `/api/admin/positions/${editPosition.id}` : "/api/admin/positions"
      const method = editPosition ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(positionForm),
      })

      if (response.ok) {
        setPositionDialog(false)
        setEditPosition(null)
        setPositionForm({
          title: "",
          description: "",
          requirements: "",
          location: "",
          type: "Full-time",
          isOpen: true,
        })
        fetchPositions()
      }
    } catch (error) {
      console.error("Error saving position:", error)
    }
  }

  const handleDeletePosition = async (id: string) => {
    if (!confirm("Yakin ingin menghapus posisi ini?")) return

    try {
      const response = await fetch(`/api/admin/positions/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchPositions()
      }
    } catch (error) {
      console.error("Error deleting position:", error)
    }
  }

  // --- UTILITY HANDLERS ---

  const handleLogout = () => {
    sessionStorage.removeItem('admin')
    window.location.href = '/admin/login'
  }

  const formatPhoneNumber = (phoneNumber: string) => {
    let formattedNumber = phoneNumber.replace(/\D/g, "")
    if (formattedNumber.startsWith("0")) {
      formattedNumber = "62" + formattedNumber.substring(1)
    } else if (!formattedNumber.startsWith("62")) {
      formattedNumber = "62" + formattedNumber
    }
    return formattedNumber
  }

  const generateWhatsAppMessage = useCallback(() => {
    if (!selectedApp || !interviewForm.scheduledDate || !interviewForm.location) {
      return ""
    }

    const date = new Date(interviewForm.scheduledDate)
    const dateStr = date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    const timeStr = date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })

    const message = `Halo ${selectedApp.fullName},

Selamat! Kami dari PT Sarana Media Cemerlang (Jagonet) ingin mengundang Anda untuk interview untuk posisi *${selectedApp.position.title}*.

📅 *Jadwal Interview:*
Tanggal: ${dateStr}
Waktu: ${timeStr} WIB
Lokasi: ${interviewForm.location}

${interviewForm.notes ? `📝 *Catatan:*\n${interviewForm.notes}\n\n` : ""}Mohon konfirmasi kehadiran Anda dengan membalas pesan ini.

Terima kasih dan sampai jumpa!

---
*PT Sarana Media Cemerlang*
Jagonet - Internet Service Provider`

    return message
  }, [interviewForm, selectedApp])

  const handleSendWhatsApp = () => {
    if (!selectedApp) return
    const message = generateWhatsAppMessage()
    const phoneNumber = formatPhoneNumber(selectedApp.whatsapp)
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

    window.open(whatsappUrl, "_blank")
  }

  const handleSendStatusWhatsApp = (app: Application, status: string) => {
    const phoneNumber = formatPhoneNumber(app.whatsapp)

    let message = ""
    if (status === "ACCEPTED") {
      message = `Selamat ${app.fullName}! 🎉

Kami dengan senang hati memberitahukan bahwa Anda *DITERIMA* untuk posisi *${app.position.title}* di PT Sarana Media Cemerlang (Jagonet).

Tim HRD kami akan segera menghubungi Anda untuk proses selanjutnya.

Selamat bergabung dengan keluarga besar Jagonet! 🚀

---
*PT Sarana Media Cemerlang*
Jagonet - Internet Service Provider`
    } else if (status === "REJECTED") {
      message = `Halo ${app.fullName},

Terima kasih atas minat dan waktu Anda untuk melamar posisi *${app.position.title}* di PT Sarana Media Cemerlang (Jagonet).

Setelah melalui proses seleksi yang ketat, dengan berat hati kami informasikan bahwa saat ini kami belum dapat melanjutkan lamaran Anda untuk posisi tersebut.

Kami sangat menghargai usaha Anda dan berharap dapat bekerja sama di kesempatan lain.

Sukses selalu untuk karir Anda! 💪

---
*PT Sarana Media Cemerlang*
Jagonet - Internet Service Provider`
    }

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  const handleConfirmStatusChange = () => {
    if (!confirmAction) return

    // Update status di backend
    handleUpdateStatus(confirmAction.app.id, confirmAction.status)
    // Kirim notifikasi WhatsApp
    handleSendStatusWhatsApp(confirmAction.app, confirmAction.status)

    setConfirmDialog(false)
    setConfirmAction(null)
  }

  const openEditPosition = (position: Position) => {
    setEditPosition(position)
    setPositionForm({
      title: position.title,
      description: position.description,
      requirements: position.requirements,
      location: position.location,
      type: position.type,
      isOpen: position.isOpen,
    })
    setPositionDialog(true)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; icon: any; label: string }> = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Menunggu" },
      INTERVIEW_SCHEDULED: { color: "bg-blue-100 text-blue-800", icon: Calendar, label: "Terjadwal Interview" },
      INTERVIEWED: { color: "bg-purple-100 text-purple-800", icon: UserCheck, label: "Sudah Interview" },
      ACCEPTED: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Diterima" },
      REJECTED: { color: "bg-red-100 text-red-800", icon: XCircle, label: "Ditolak" },
    }

    const config = variants[status] || variants.PENDING
    const Icon = config.icon

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  // --- USE EFFECTS ---

  useEffect(() => {
    const adminData = sessionStorage.getItem('admin')
    if (!adminData) {
      window.location.href = '/admin/login'
      return
    }
    setAdmin(JSON.parse(adminData))
    fetchData()
  }, [fetchData]) // Dependensi ditambahkan

  useEffect(() => {
    if (admin) {
      fetchApplications()
    }
  }, [admin, filterStatus, fetchApplications]) // Dependensi ditambahkan

  useEffect(() => {
    if (interviewDialog && selectedApp) {
      setWhatsappPreview(generateWhatsAppMessage())
    }
  }, [interviewForm, selectedApp, interviewDialog, generateWhatsAppMessage]) // Dependensi ditambahkan

  // --- MEMOIZED VALUES (menggunakan useMemo) ---

  const stats = useMemo(() => ({
    total: applications.length,
    pending: applications.filter((a) => a.status === "PENDING").length,
    interview: applications.filter((a) => a.status === "INTERVIEW_SCHEDULED" || a.status === "INTERVIEWED").length,
    accepted: applications.filter((a) => a.status === "ACCEPTED").length,
    rejected: applications.filter((a) => a.status === "REJECTED").length,
    openPositions: positions.filter((p) => p.isOpen).length,
  }), [applications, positions])

  // --- RENDER LOGIC ---

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-100 border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
                Dashboard Admin
              </h1>
              <p className="text-sm text-slate-600">PT Sarana Media Cemerlang - Jagonet</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">HRD Jagonet</p>
                <p className="text-xs text-slate-500">{admin?.email}</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="applications" className="gap-2">
              <Users className="h-4 w-4" />
              Kandidat
            </TabsTrigger>
            <TabsTrigger value="positions" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Posisi
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-slate-900" />
                    Total Lamaran
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-slate-900">{stats.total}</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    Menunggu Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-yellow-600">{stats.pending}</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-slate-700" />
                    Interview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-slate-700">{stats.interview}</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Diterima
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-green-600">{stats.accepted}</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    Ditolak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-red-600">{stats.rejected}</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-indigo-600" />
                    Posisi Terbuka
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-indigo-600">{stats.openPositions}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Applications */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Lamaran Terbaru</CardTitle>
                <CardDescription>
                  {applications.length > 0
                    ? `${applications.length} lamaran terbaru yang masuk — diperbarui ${new Date().toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}`
                    : "Belum ada lamaran yang masuk"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.slice(0, 5).map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">{app.fullName}</p>
                        <p className="text-sm text-slate-600">{app.position.title}</p>
                        <p className="text-xs text-slate-500">{formatDate(app.createdAt)}</p>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Kelola Kandidat</CardTitle>
                    <CardDescription>Manage semua lamaran yang masuk</CardDescription>
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Semua Status</SelectItem>
                      <SelectItem value="PENDING">Menunggu</SelectItem>
                      <SelectItem value="INTERVIEW_SCHEDULED">Terjadwal Interview</SelectItem>
                      <SelectItem value="INTERVIEWED">Sudah Interview</SelectItem>
                      <SelectItem value="ACCEPTED">Diterima</SelectItem>
                      <SelectItem value="REJECTED">Ditolak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Posisi</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Dokumen</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.fullName}</TableCell>
                          <TableCell>{app.position.title}</TableCell>
                          <TableCell>{app.email}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {app.photo3x4Url && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-blue-600 hover:text-blue-700"
                                  onClick={() => {
                                    setSelectedApp(app)
                                    setDocumentDialog(true)
                                  }}
                                >
                                  <ImageIcon className="h-4 w-4" />
                                </Button>
                              )}
                              {app.ktpUrl && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className={
                                    app.ktpVerified
                                      ? "text-green-600 hover:text-green-700"
                                      : "text-red-600 hover:text-red-700"
                                  }
                                  onClick={() => {
                                    setSelectedApp(app)
                                    setDocumentDialog(true)
                                  }}
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(app.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="flex items-center gap-2">
  {/* Tombol Lihat Detail */}
  <Button
    size="sm"
    variant="outline"
    className="h-7 px-2"
    onClick={() => {
      setSelectedApp(app)
      setViewDialog(true)
    }}
  >
    <Eye className="h-4 w-4" />
  </Button>

  {/* Jika status masih PENDING, tampilkan dua tombol tambahan */}
  {app.status === "PENDING" && (
    <>
      {/* Tombol Tolak */}
      <Button
        size="sm"
        className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 h-7"
        onClick={() => {
          setConfirmAction({ status: "REJECTED", app })
          setConfirmDialog(true)
        }}
      >
        <XCircle className="h-3.5 w-3.5 mr-1" />
        Tolak
      </Button>

      {/* Tombol Interview */}
      <Button
        size="sm"
        variant="outline"
        className="h-7 px-2 text-xs"
        onClick={() => {
          setSelectedApp(app)
          setInterviewDialog(true)
        }}
      >
        <Calendar className="h-3.5 w-3.5 mr-1" />
        Interview
      </Button>
    </>
  )}
</div>

                              {(app.status === "INTERVIEW_SCHEDULED" || app.status === "INTERVIEWED") ? (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => {
                                      setConfirmAction({ status: "ACCEPTED", app })
                                      setConfirmDialog(true)
                                    }}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Terima
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    onClick={() => {
                                      setConfirmAction({ status: "REJECTED", app })
                                      setConfirmDialog(true)
                                    }}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Tolak
                                  </Button>
                                </>
                              ) : null}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Positions Tab */}
          <TabsContent value="positions" className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Kelola Posisi</CardTitle>
                    <CardDescription>Manage posisi lowongan yang tersedia</CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      setEditPosition(null)
                      setPositionForm({
                        title: "",
                        description: "",
                        requirements: "",
                        location: "",
                        type: "Full-time",
                        isOpen: true,
                      })
                      setPositionDialog(true)
                    }}
                    className="bg-gradient-to-r from-slate-800 to-slate-900"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Posisi
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {positions.map((position) => (
                    <Card key={position.id} className="border-2 hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{position.title}</CardTitle>
                            <CardDescription className="mt-1">
                              {position.location} • {position.type}
                            </CardDescription>
                          </div>
                          <Badge variant={position.isOpen ? "default" : "secondary"}>
                            {position.isOpen ? "Buka" : "Tutup"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-slate-600 line-clamp-3">{position.description}</p>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Users className="h-4 w-4" />
                          <span>{position._count?.applications || 0} pelamar</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEditPosition(position)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 bg-transparent"
                            onClick={() => handleDeletePosition(position.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Hapus
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsContent/>
          </TabsContent>
        </Tabs>
      </div>

      {/* --- DIALOGS (Dapat dipisahkan ke file komponen terpisah) --- */}

      {/* Document Viewer Dialog */}
      <Dialog open={documentDialog} onOpenChange={setDocumentDialog}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>Dokumen - {selectedApp?.fullName}</DialogTitle>
            <DialogDescription>Lihat foto 3x4 dan KTP kandidat</DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-6">
              {/* Foto 3x4 */}
              {selectedApp.photo3x4Url && (
                <div>
                  <Label className="text-base font-semibold mb-3 block">Foto 3x4</Label>
                  <div
                    className="border-2 border-slate-200 rounded-lg p-3 bg-slate-50 cursor-pointer hover:opacity-90 transition"
                    onClick={() => window.open(selectedApp.photo3x4Url || "", "_blank")}
                    title="Klik untuk melihat foto"
                  >
                    <img
                      src={selectedApp.photo3x4Url || "/placeholder.svg"}
                      alt="Foto 3x4"
                      className="max-w-full h-auto rounded-md mx-auto"
                    />
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full mt-2 bg-transparent"
                  >
                    <a
                      href={selectedApp.photo3x4Url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Foto 3x4
                    </a>
                  </Button>
                </div>
              )}

              {/* KTP */}
{selectedApp.ktpUrl && (
  <div>
    <Label className="text-base font-semibold mb-3 flex items-center gap-2">
      KTP{" "}
      {selectedApp.ktpVerified ? (
        <Badge className="bg-green-100 text-green-800">Terverifikasi</Badge>
      ) : (
        <Badge className="bg-red-100 text-red-800">Tidak Valid</Badge>
      )}
    </Label>

    {/* Detect apakah file PDF */}
    {selectedApp.ktpUrl.toLowerCase().endsWith(".pdf") ? (
      <div className="border-2 border-slate-200 rounded-lg bg-slate-50 p-3">
        <iframe
          src={selectedApp.ktpUrl}
          className="w-full h-[500px] rounded-md"
          title="Preview KTP PDF"
        ></iframe>
      </div>
    ) : (
      <div
        className="border-2 border-slate-200 rounded-lg p-3 bg-slate-50 cursor-pointer hover:opacity-90 transition"
        onClick={() => window.open(selectedApp.ktpUrl, "_blank")}
        title="Klik untuk melihat KTP"
      >
        <img
          src={selectedApp.ktpUrl}
          alt="KTP"
          className="max-w-full h-auto rounded-md mx-auto"
        />
      </div>
    )}

    <Button
      asChild
      variant="outline"
      className="w-full mt-2 bg-transparent"
    >
      <a
        href={selectedApp.ktpUrl}
        target="_blank"
        rel="noopener noreferrer"
        download
      >
        <Download className="h-4 w-4 mr-2" />
        Download KTP
      </a>
    </Button>
  </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* View Dialog (Anda belum menyertakan konten Dialog ini secara lengkap di kode aslinya, jadi saya asumsikan ini untuk detail kandidat) */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
              <DialogHeader>
                  <DialogTitle>Detail Kandidat - {selectedApp?.fullName}</DialogTitle>
                  <DialogDescription>Informasi lengkap dari lamaran {selectedApp?.fullName}</DialogDescription>
              </DialogHeader>
              {/* Tambahkan Detail Kandidat di sini */}
              {selectedApp && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                          <p><span className="font-semibold text-slate-600">NIK:</span> {selectedApp.nik}</p>
                          <p><span className="font-semibold text-slate-600">Email:</span> {selectedApp.email}</p>
                          <p><span className="font-semibold text-slate-600">Telepon:</span> {selectedApp.phone}</p>
                          <p><span className="font-semibold text-slate-600">WhatsApp:</span> {selectedApp.whatsapp}</p>
                          <p><span className="font-semibold text-slate-600">Pendidikan:</span> {selectedApp.education}</p>
                          <p><span className="font-semibold text-slate-600">Melamar Posisi:</span> {selectedApp.position.title} ({selectedApp.position.location})</p>
                          <p><span className="font-semibold text-slate-600">Tanggal Daftar:</span> {formatDateTime(selectedApp.createdAt)}</p>
                          <p>
                            <span className="font-semibold text-slate-600">Status:</span> {getStatusBadge(selectedApp.status)}
                          </p>
                          {selectedApp.interviewSchedule && (
                            <div className="mt-4 p-3 border rounded-lg bg-blue-50">
                              <p className="font-semibold text-blue-800 mb-1 flex items-center gap-1"><Calendar className="h-4 w-4" /> Jadwal Interview</p>
                              <p>Tanggal: {formatDateTime(selectedApp.interviewSchedule.scheduledDate)}</p>
                              <p>Lokasi: {selectedApp.interviewSchedule.location}</p>
                              {selectedApp.interviewSchedule.notes && <p>Catatan: {selectedApp.interviewSchedule.notes}</p>}
                            </div>
                          )}
                      </div>
                      <div className="space-y-2">
                          <p className="font-semibold text-slate-600">Alamat:</p>
                          <p className="border p-2 rounded-md bg-slate-50">{selectedApp.address}</p>
                          <p className="font-semibold text-slate-600">CV:</p>
                          <a href={selectedApp.cvUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline">
                              <Download className="h-4 w-4" /> Download CV
                          </a>
                          {/* Tambahkan lebih banyak detail jika ada */}
                      </div>
                  </div>
              )}
              <DialogFooter>
                  <Button variant="outline" onClick={() => setViewDialog(false)}>Tutup</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>


      {/* Interview Dialog */}
      <Dialog open={interviewDialog} onOpenChange={setInterviewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-600" />
              Jadwalkan Interview
            </DialogTitle>
            <DialogDescription>Buat jadwal interview untuk {selectedApp?.fullName}</DialogDescription>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="scheduledDate" className="text-base font-semibold">
                  Tanggal & Waktu
                </Label>
                <Input
                  id="scheduledDate"
                  type="datetime-local"
                  value={interviewForm.scheduledDate}
                  onChange={(e) => setInterviewForm({ ...interviewForm, scheduledDate: e.target.value })}
                  required
                  className="h-11"
                />
              </div>
              <div>
                <Label htmlFor="location" className="text-base font-semibold">
                  Lokasi
                </Label>
                <Input
                  id="location"
                  value={interviewForm.location}
                  onChange={(e) => setInterviewForm({ ...interviewForm, location: e.target.value })}
                  placeholder="Kantor Jagonet"
                  required
                  className="h-11"
                />
              </div>
              <div>
                <Label htmlFor="notes" className="text-base font-semibold">
                  Catatan
                </Label>
                <Textarea
                  id="notes"
                  value={interviewForm.notes}
                  onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                  placeholder="Catatan tambahan"
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-base font-semibold mb-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                Preview WhatsApp
              </Label>
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 min-h-[320px] max-h-[420px] overflow-y-auto">
                {whatsappPreview ? (
                  <pre className="text-xs whitespace-pre-wrap font-sans text-slate-800 leading-relaxed">
                    {whatsappPreview}
                  </pre>
                ) : (
                  <p className="text-sm text-slate-400 italic">Isi form untuk preview...</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 mt-6">
            <Button variant="outline" onClick={() => setInterviewDialog(false)} className="w-full sm:w-auto">
              Batal
            </Button>
            <Button
              onClick={handleScheduleInterview}
              disabled={!interviewForm.scheduledDate || !interviewForm.location}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Kirim via WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {confirmAction?.status === "ACCEPTED" ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span>Terima Kandidat</span>
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-600" />
                  <span>Tolak Kandidat</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {confirmAction && (
            <div className="space-y-4">
              <DialogDescription>
                Anda akan mengubah status **{confirmAction.app.fullName}** menjadi **{confirmAction.status === "ACCEPTED" ? "DITERIMA" : "DITOLAK"}** dan mengirim notifikasi WhatsApp. Lanjutkan?
              </DialogDescription>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                <p className="text-sm">
                  <span className="text-slate-500">Nama:</span>{" "}
                  <span className="font-medium">{confirmAction.app.fullName}</span>
                </p>
                <p className="text-sm">
                  <span className="text-slate-500">Posisi:</span>{" "}
                  <span className="font-medium">{confirmAction.app.position.title}</span>
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setConfirmDialog(false)
                setConfirmAction(null)
              }}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirmStatusChange}
              className={`w-full sm:w-auto ${
                confirmAction?.status === "ACCEPTED" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {confirmAction?.status === "ACCEPTED" ? "Ya, Terima" : "Ya, Tolak"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Position Dialog (Add/Edit) */}
      <Dialog open={positionDialog} onOpenChange={setPositionDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editPosition ? "Edit Posisi" : "Tambah Posisi Baru"}</DialogTitle>
            <DialogDescription>
              {editPosition ? `Mengubah posisi: ${editPosition.title}` : "Buat lowongan pekerjaan baru"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Judul Posisi</Label>
              <Input
                id="title"
                value={positionForm.title}
                onChange={(e) => setPositionForm({ ...positionForm, title: e.target.value })}
                placeholder="Network Engineer"
              />
            </div>
            <div>
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={positionForm.description}
                onChange={(e) => setPositionForm({ ...positionForm, description: e.target.value })}
                placeholder="Deskripsi posisi pekerjaan..."
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="requirements">Persyaratan</Label>
              <Textarea
                id="requirements"
                value={positionForm.requirements}
                onChange={(e) => setPositionForm({ ...positionForm, requirements: e.target.value })}
                placeholder="- S1 Teknik Informatika\n- Pengalaman 2 tahun"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Lokasi</Label>
                <Input
                  id="location"
                  value={positionForm.location}
                  onChange={(e) => setPositionForm({ ...positionForm, location: e.target.value })}
                  placeholder="Jakarta"
                />
              </div>
              <div>
                <Label htmlFor="type">Tipe Pekerjaan</Label>
                <Select
                  value={positionForm.type}
                  onValueChange={(value) => setPositionForm({ ...positionForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isOpen"
                checked={positionForm.isOpen}
                onChange={(e) => setPositionForm({ ...positionForm, isOpen: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="isOpen" className="cursor-pointer">
                Posisi dibuka untuk lamaran
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPositionDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleSavePosition} className="bg-slate-900 hover:bg-slate-800">
              {editPosition ? "Update Posisi" : "Simpan Posisi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}