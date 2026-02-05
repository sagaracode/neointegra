import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ServerIcon,
  SignalIcon,
} from '@heroicons/react/24/outline'
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import toast from 'react-hot-toast'

// Data untuk timeline serangan bulanan
const attackTimelineData = [
  { month: 'Feb 25', attacks: 850 },
  { month: 'Mar 25', attacks: 920 },
  { month: 'Apr 25', attacks: 780 },
  { month: 'Mei 25', attacks: 2400 }, // Lonjakan Botnet Aisuru
  { month: 'Jun 25', attacks: 2800 },
  { month: 'Jul 25', attacks: 2650 },
  { month: 'Agu 25', attacks: 1900 }, // Upaya Ransomware
  { month: 'Sep 25', attacks: 2100 },
  { month: 'Okt 25', attacks: 1800 },
  { month: 'Nov 25', attacks: 1200 },
  { month: 'Des 25', attacks: 950 },
  { month: 'Jan 26', attacks: 820 },
  { month: 'Feb 26', attacks: 750 },
]

// Data untuk vektor ancaman
const threatVectorData = [
  { name: 'DDoS', value: 45, color: '#ef4444' },
  { name: 'Malware/Ransomware', value: 20, color: '#f97316' },
  { name: 'Phishing', value: 15, color: '#eab308' },
  { name: 'IoMT Exploits', value: 10, color: '#06b6d4' },
  { name: 'Insider Threat', value: 10, color: '#8b5cf6' },
]

// Data asal serangan
const threatOriginData = [
  { location: 'Domestik/Indonesia', percentage: 60, color: '#ef4444' },
  { location: 'Unknown/Proxy', percentage: 15, color: '#f97316' },
  { location: 'Amerika Utara', percentage: 10, color: '#eab308' },
  { location: 'Asia Timur', percentage: 8, color: '#06b6d4' },
  { location: 'Eropa Timur', percentage: 7, color: '#8b5cf6' },
]

// Data akses rekam medis yang diblokir
const blockedAccessData = [
  {
    id: 1,
    user: 'Nurse_Station_2',
    file: 'File_General_X',
    time: 'Di Luar Jam Kerja',
    status: 'BLOCKED',
  },
  {
    id: 2,
    user: 'External_Device_Unknown',
    file: 'Record_VVIP_Minister',
    time: '03:24 AM',
    status: 'BLOCKED',
  },
  {
    id: 3,
    user: 'Temp_Access_987',
    file: 'Data_Sensitive_VIP',
    time: 'Expired Credential',
    status: 'BLOCKED',
  },
]

export default function CyberSecurityDashboard() {
  const [isExporting, setIsExporting] = useState(false)

  // KPI Stats
  const kpiStats = [
    {
      title: 'Total Threats Blocked',
      value: '14,502',
      subtitle: 'Rata-rata ~40/hari. Naik 25%',
      icon: ShieldCheckIcon,
      color: 'from-red-500 to-orange-500',
      bgColor: 'from-red-500/20 to-orange-500/20',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-400',
    },
    {
      title: 'System Uptime (HIS/EMR)',
      value: '99.96%',
      subtitle: 'Downtime Terjadwal: 3j 30m (Patching)',
      icon: CheckCircleIcon,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
    },
    {
      title: 'Data Breach Attempts',
      value: '0 Sukses',
      subtitle: '42 Percobaan Besar. Data VVIP Aman',
      icon: ExclamationTriangleIcon,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
    },
    {
      title: 'Compliance Score',
      value: '98/100',
      subtitle: 'Audit BSSN & ISO 27001 (Des 2025)',
      icon: ClockIcon,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
    },
  ]

  // IoMT Device Status
  const iomtStatus = [
    { label: 'Aman/Secured', count: 437, total: 450, color: 'bg-green-500', status: 'safe' },
    {
      label: 'Rentan (Butuh Update)',
      count: 12,
      total: 450,
      color: 'bg-yellow-500',
      status: 'warning',
    },
    {
      label: 'Dikuarantina (X-Ray IGD)',
      count: 1,
      total: 450,
      color: 'bg-red-500',
      status: 'danger',
    },
  ]

  // Export to PDF
  const handleExportPDF = async () => {
    setIsExporting(true)
    toast.loading('Menyiapkan laporan PDF...')

    try {
      const element = document.getElementById('cyber-dashboard-content')
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#0f172a',
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save('RSPPN-Cyber-Security-Report-Feb2025-Feb2026.pdf')
      toast.dismiss()
      toast.success('Laporan berhasil diunduh!')
    } catch (error) {
      toast.dismiss()
      toast.error('Gagal mengekspor PDF')
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-300 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="font-montserrat font-bold text-3xl md:text-4xl text-white mb-2">
                RSPPN <span className="gradient-text">Cyber Defense</span> & Situational Awareness
              </h1>
              <p className="text-gray-400 font-poppins">
                Periode Laporan: <span className="text-white font-semibold">01 Feb 2025 – 01 Feb 2026</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/30">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-green-400 font-semibold text-sm">LIVE MONITORING</span>
              </div>
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="btn btn-primary flex items-center gap-2"
              >
                <DocumentArrowDownIcon className="w-5 h-5" />
                {isExporting ? 'Exporting...' : 'Export PDF'}
              </button>
            </div>
          </div>
        </motion.div>

        <div id="cyber-dashboard-content" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl bg-gradient-to-br ${stat.bgColor} border ${stat.borderColor} hover:scale-105 transition-transform`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="font-montserrat font-bold text-2xl text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-400 font-poppins text-xs mb-2">{stat.title}</div>
                <div className={`${stat.textColor} font-poppins text-xs`}>{stat.subtitle}</div>
              </motion.div>
            ))}
          </div>

          {/* Main Visualization Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Line Chart - Timeline Serangan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 card"
            >
              <h3 className="font-montserrat font-bold text-xl text-white mb-6">
                Timeline Serangan Bulanan
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attackTimelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(value, name, props) => {
                      const month = props.payload.month
                      if (month === 'Mei 25' || month === 'Jun 25' || month === 'Jul 25') {
                        return [value, 'Serangan Botnet Aisuru']
                      }
                      if (month === 'Agu 25' || month === 'Sep 25' || month === 'Okt 25') {
                        return [value, 'Upaya Ransomware']
                      }
                      return [value, 'Serangan']
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="attacks"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ fill: '#ef4444', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-gray-300 font-poppins">
                  <span className="text-red-400 font-semibold">⚠️ Peak Activity:</span> Mei-Juli 2025 (Serangan Botnet Aisuru), Agustus-Oktober 2025 (Upaya Ransomware)
                </p>
              </div>
            </motion.div>

            {/* Pie Chart - Vektor Ancaman */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
            >
              <h3 className="font-montserrat font-bold text-xl text-white mb-6">
                Analisis Vektor Ancaman
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={threatVectorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${value}%`}
                    labelStyle={{ fill: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  >
                    {threatVectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {threatVectorData.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-300 font-poppins flex-1">{item.name}</span>
                    <span className="text-sm text-white font-semibold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Detail Monitoring Widgets */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Widget A: Asal Serangan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h3 className="font-montserrat font-bold text-lg text-white mb-4 flex items-center gap-2">
                <SignalIcon className="w-5 h-5 text-red-400" />
                Geo-Politics Threat Origin
              </h3>
              <div className="space-y-3">
                {threatOriginData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300 font-poppins">{item.location}</span>
                      <span className="text-white font-semibold">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Widget B: Monitoring Privasi VVIP */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h3 className="font-montserrat font-bold text-lg text-white mb-2 flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-blue-400" />
                Akses Rekam Medis VVIP
              </h3>
              <div className="flex items-center gap-4 mb-4 text-sm">
                <span className="text-green-400 font-semibold">✓ 1,240 Diizinkan</span>
                <span className="text-red-400 font-semibold">✕ 3 DIBLOKIR</span>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {blockedAccessData.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 bg-red-500/10 border border-red-500/30 rounded text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-300 font-mono">{item.user}</span>
                      <span className="text-red-400 font-semibold">{item.status}</span>
                    </div>
                    <div className="text-gray-400">
                      File: <span className="text-white">{item.file}</span>
                    </div>
                    <div className="text-gray-500 text-xs">{item.time}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Widget C: Status Keamanan IoMT */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <h3 className="font-montserrat font-bold text-lg text-white mb-2 flex items-center gap-2">
                <ServerIcon className="w-5 h-5 text-cyan-400" />
                Kesehatan Alat Medis
              </h3>
              <p className="text-sm text-gray-400 mb-4">Total: 450 Unit</p>
              <div className="space-y-4">
                {iomtStatus.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300 font-poppins">{item.label}</span>
                      <span className="text-sm text-white font-semibold">
                        {item.count} Unit
                      </span>
                    </div>
                    <div className="relative w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all ${item.color} ${
                          item.status === 'danger' ? 'animate-pulse' : ''
                        }`}
                        style={{ width: `${(item.count / item.total) * 100}%` }}
                      ></div>
                    </div>
                    {item.status === 'danger' && (
                      <p className="text-xs text-red-400 mt-1 animate-pulse">
                        ⚠️ Ancaman Terdeteksi - Dikuarantina
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="card bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30"
          >
            <div className="flex items-start gap-4">
              <ShieldCheckIcon className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-montserrat font-bold text-white mb-2">
                  Status Keamanan Keseluruhan: SECURE
                </h4>
                <p className="text-sm text-gray-300 font-poppins leading-relaxed">
                  Sistem pertahanan RSPPN beroperasi optimal. Semua lapisan keamanan (Network, Application, Data) aktif dan termonitor 24/7. 
                  Zero successful data breach pada periode pelaporan. Compliance score tinggi mencerminkan kesiapan menghadapi audit eksternal. 
                  Tim Security Operations Center (SOC) siaga penuh.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
