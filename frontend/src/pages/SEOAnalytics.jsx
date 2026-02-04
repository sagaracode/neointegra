import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  RocketLaunchIcon,
  CursorArrowRaysIcon,
} from '@heroicons/react/24/outline'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import toast from 'react-hot-toast'
import seoDataJSON from '../data/seoData.json'

function SEOAnalytics() {
  const [seoData, setSeoData] = useState(seoDataJSON)
  const [keywords, setKeywords] = useState(seoDataJSON.allKeywords)
  const [showAddKeyword, setShowAddKeyword] = useState(false)
  const [newKeyword, setNewKeyword] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Filtered keywords based on search
  const filteredKeywords = keywords.filter(keyword =>
    keyword.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      const updatedKeywords = [...keywords, newKeyword.trim()]
      setKeywords(updatedKeywords)
      setNewKeyword('')
      setShowAddKeyword(false)
      toast.success('Kata kunci berhasil ditambahkan!')
    } else {
      toast.error('Mohon masukkan kata kunci yang valid')
    }
  }

  const handleDeleteKeyword = (keywordToDelete) => {
    setKeywords(keywords.filter(k => k !== keywordToDelete))
    toast.success('Kata kunci berhasil dihapus!')
  }

  // Calculate summary stats
  const latestData = seoData.monthlyData[seoData.monthlyData.length - 1]
  const firstData = seoData.monthlyData[0]
  const totalTrafficGrowth = ((latestData.traffic - firstData.traffic) / firstData.traffic * 100).toFixed(1)
  const avgHealthScore = (seoData.monthlyData.reduce((sum, d) => sum + d.healthScore, 0) / seoData.monthlyData.length).toFixed(1)
  const totalClicks = seoData.monthlyData.reduce((sum, d) => sum + d.clicks, 0)
  const totalImpressions = seoData.monthlyData.reduce((sum, d) => sum + d.impressions, 0)
  const avgCTR = ((totalClicks / totalImpressions) * 100).toFixed(1)

  return (
    <div className="min-h-screen bg-dark-300 p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <RocketLaunchIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="font-montserrat font-bold text-3xl md:text-4xl text-white">
              SEO Report Bulanan
            </h1>
            <p className="text-gray-400 font-poppins mt-1">
              Analitik SEO untuk {seoData.domain} • {seoData.period}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 font-poppins text-sm mb-2">Traffic Growth</p>
              <div className="flex items-end gap-2">
                <span className="font-montserrat font-bold text-3xl text-white">
                  {totalTrafficGrowth}%
                </span>
                <ArrowTrendingUpIcon className={`w-6 h-6 mb-1 ${parseFloat(totalTrafficGrowth) >= 0 ? 'text-green-400' : 'text-red-400'}`} />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {firstData.traffic.toLocaleString()} → {latestData.traffic.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="card bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 font-poppins text-sm mb-2">Health Score</p>
              <div className="flex items-end gap-2">
                <span className="font-montserrat font-bold text-3xl text-white">
                  {avgHealthScore}
                </span>
                <span className="text-green-400 text-sm mb-1">/100</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Current: {latestData.healthScore}/100
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">✓</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="card bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 font-poppins text-sm mb-2">Avg Position</p>
              <div className="flex items-end gap-2">
                <span className="font-montserrat font-bold text-3xl text-white">
                  #{latestData.avgPosition.toFixed(1)}
                </span>
                <ArrowTrendingUpIcon className="w-6 h-6 text-green-400 mb-1" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                From #{firstData.avgPosition.toFixed(1)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <MagnifyingGlassIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="card bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 font-poppins text-sm mb-2">Total Clicks</p>
              <div className="flex items-end gap-2">
                <span className="font-montserrat font-bold text-3xl text-white">
                  {(totalClicks / 1000).toFixed(1)}K
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {totalImpressions.toLocaleString()} impressions
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <CursorArrowRaysIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="card bg-gradient-to-br from-rose-500/10 to-pink-500/10 border-rose-500/30"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 font-poppins text-sm mb-2">Average CTR</p>
              <div className="flex items-end gap-2">
                <span className="font-montserrat font-bold text-3xl text-white">
                  {avgCTR}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Click-through rate
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Traffic Timeline Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card mb-8"
      >
        <div className="mb-6">
          <h2 className="font-montserrat font-bold text-xl text-white mb-1">
            Traffic Organik Timeline
          </h2>
          <p className="text-gray-400 font-poppins text-sm">
            Perkembangan pengunjung dari Februari 2025 - Februari 2026
          </p>
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={seoData.monthlyData}>
            <defs>
              <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="month" 
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="traffic" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#trafficGradient)"
              name="Pengunjung"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Health Score & Keyword Position */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="mb-6">
            <h2 className="font-montserrat font-bold text-xl text-white mb-1">
              Website Health Score
            </h2>
            <p className="text-gray-400 font-poppins text-sm">
              Kesehatan teknis website
            </p>
          </div>
          
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={seoData.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="month" 
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="healthScore" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 4 }}
                name="Health Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="mb-6">
            <h2 className="font-montserrat font-bold text-xl text-white mb-1">
              Posisi Keyword (Avg)
            </h2>
            <p className="text-gray-400 font-poppins text-sm">
              Rata-rata peringkat di Google (semakin kecil semakin baik)
            </p>
          </div>
          
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={seoData.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="month" 
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                reversed
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="avgPosition" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ fill: '#f59e0b', r: 4 }}
                name="Avg Position"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Demographics Section - Pie Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card mb-8"
      >
        <div className="mb-6">
          <h2 className="font-montserrat font-bold text-xl text-white mb-1">
            Demografi Pengunjung
          </h2>
          <p className="text-gray-400 font-poppins text-sm">
            Profil pengunjung berdasarkan usia, jenis kelamin, dan lokasi (Jabodetabek)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Age Distribution */}
          <div className="p-4 rounded-xl bg-dark-200/50 border border-gray-700">
            <h3 className="font-montserrat font-semibold text-white mb-4 text-center">Rentang Usia</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={seoData.demographics.age}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ range, value }) => `${range}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {seoData.demographics.age.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value) => `${value}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gender Distribution */}
          <div className="p-4 rounded-xl bg-dark-200/50 border border-gray-700">
            <h3 className="font-montserrat font-semibold text-white mb-4 text-center">Jenis Kelamin</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={seoData.demographics.gender}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {seoData.demographics.gender.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value) => `${value}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Location Distribution */}
          <div className="p-4 rounded-xl bg-dark-200/50 border border-gray-700">
            <h3 className="font-montserrat font-semibold text-white mb-4 text-center">Lokasi (Jabodetabek)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={seoData.demographics.location}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {seoData.demographics.location.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value, name) => [`${value}%`, name]}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry) => `${entry.payload.name}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Keyword Metrics Table - Like Ahrefs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card mb-8"
      >
        <div className="mb-6">
          <h2 className="font-montserrat font-bold text-xl text-white mb-1">
            Keyword Metrics Overview
          </h2>
          <p className="text-gray-400 font-poppins text-sm">
            Data keyword difficulty, volume, traffic, dan posisi seperti Ahrefs
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-200">
              <tr className="border-b border-gray-700">
                <th className="px-4 py-3 text-left font-montserrat font-semibold text-white text-sm">Keyword</th>
                <th className="px-4 py-3 text-center font-montserrat font-semibold text-white text-sm">KD</th>
                <th className="px-4 py-3 text-center font-montserrat font-semibold text-white text-sm">Volume</th>
                <th className="px-4 py-3 text-center font-montserrat font-semibold text-white text-sm">Traffic</th>
                <th className="px-4 py-3 text-center font-montserrat font-semibold text-white text-sm">CPC</th>
                <th className="px-4 py-3 text-center font-montserrat font-semibold text-white text-sm">CPS</th>
                <th className="px-4 py-3 text-center font-montserrat font-semibold text-white text-sm">Position</th>
                <th className="px-4 py-3 text-left font-montserrat font-semibold text-white text-sm">URL</th>
              </tr>
            </thead>
            <tbody>
              {seoData.keywordMetrics.map((kw, index) => (
                <tr key={index} className="border-b border-gray-800 hover:bg-dark-200/50 transition-colors">
                  <td className="px-4 py-3 text-white font-poppins">{kw.keyword}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-1 rounded text-sm font-semibold ${
                      kw.kd <= 10 ? 'bg-green-500/20 text-green-400' :
                      kw.kd <= 20 ? 'bg-yellow-500/20 text-yellow-400' :
                      kw.kd <= 30 ? 'bg-orange-500/20 text-orange-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {kw.kd}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300 font-poppins">{kw.volume.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-emerald-400 font-poppins font-semibold">{kw.traffic.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-gray-300 font-poppins">${kw.cpc}</td>
                  <td className="px-4 py-3 text-center text-gray-300 font-poppins">{kw.cps}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-1 rounded text-sm font-semibold ${
                      kw.position <= 3 ? 'bg-green-500/20 text-green-400' :
                      kw.position <= 10 ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      #{kw.position}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-blue-400 font-poppins text-sm truncate max-w-xs">{kw.url}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Performance on Search Results - Like GSC */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="card mb-8"
      >
        <div className="mb-6">
          <h2 className="font-montserrat font-bold text-xl text-white mb-1">
            Performance on Search Results
          </h2>
          <p className="text-gray-400 font-poppins text-sm">
            Halaman dengan performa terbaik - Clicks, Impressions, CTR, Position
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-200">
              <tr className="border-b border-gray-700">
                <th className="px-4 py-3 text-left font-montserrat font-semibold text-white text-sm">Halaman</th>
                <th className="px-4 py-3 text-center font-montserrat font-semibold text-white text-sm">Clicks</th>
                <th className="px-4 py-3 text-center font-montserrat font-semibold text-white text-sm">Impressions</th>
                <th className="px-4 py-3 text-center font-montserrat font-semibold text-white text-sm">CTR</th>
                <th className="px-4 py-3 text-center font-montserrat font-semibold text-white text-sm">Position</th>
              </tr>
            </thead>
            <tbody>
              {seoData.topPages.map((page, index) => (
                <tr key={index} className="border-b border-gray-800 hover:bg-dark-200/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-white font-poppins font-medium">{page.title}</span>
                      <span className="text-blue-400 text-sm truncate max-w-md">{page.url}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-emerald-400 font-poppins font-semibold">
                    {page.clicks.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300 font-poppins">
                    {page.impressions.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center text-purple-400 font-poppins font-semibold">
                    {page.ctr}%
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-sm font-semibold">
                      #{page.position.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Keyword Management Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-montserrat font-bold text-xl text-white mb-1">
              Daftar Kata Kunci SEO
            </h2>
            <p className="text-gray-400 font-poppins text-sm">
              Total {keywords.length} kata kunci • Kelola target SEO Anda
            </p>
          </div>
          <button
            onClick={() => setShowAddKeyword(!showAddKeyword)}
            className="btn-primary flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Tambah Keyword</span>
          </button>
        </div>

        {/* Add Keyword Form */}
        {showAddKeyword && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 rounded-xl bg-dark-200 border border-purple-500/30"
          >
            <div className="flex gap-3">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                placeholder="Masukkan kata kunci baru..."
                className="flex-1 px-4 py-2 bg-dark-100 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handleAddKeyword}
                className="btn-primary"
              >
                Simpan
              </button>
              <button
                onClick={() => {
                  setShowAddKeyword(false)
                  setNewKeyword('')
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
              >
                Batal
              </button>
            </div>
          </motion.div>
        )}

        {/* Search Bar */}
        <div className="mb-4 relative">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kata kunci..."
            className="w-full pl-10 pr-4 py-2 bg-dark-200 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Keywords Table */}
        <div className="overflow-x-auto">
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            <table className="w-full">
              <thead className="sticky top-0 bg-dark-200 z-10">
                <tr className="border-b border-gray-700">
                  <th className="px-4 py-3 text-left font-montserrat font-semibold text-white text-sm">
                    #
                  </th>
                  <th className="px-4 py-3 text-left font-montserrat font-semibold text-white text-sm">
                    Kata Kunci
                  </th>
                  <th className="px-4 py-3 text-right font-montserrat font-semibold text-white text-sm">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredKeywords.map((keyword, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-gray-800 hover:bg-dark-200/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-400 font-poppins text-sm">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-white font-poppins">
                      {keyword}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteKeyword(keyword)}
                        className="text-red-400 hover:text-red-300 transition-colors p-1"
                        title="Hapus keyword"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredKeywords.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            Tidak ada kata kunci yang ditemukan
          </div>
        )}
      </motion.div>

      {/* Focus Keywords by Month */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="card mt-8"
      >
        <div className="mb-6">
          <h2 className="font-montserrat font-bold text-xl text-white mb-1">
            Fokus Kata Kunci Per Bulan
          </h2>
          <p className="text-gray-400 font-poppins text-sm">
            5 kata kunci prioritas untuk setiap bulan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {seoData.monthlyData.map((month, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + index * 0.05 }}
              className="p-4 rounded-xl bg-dark-200 border border-gray-700 hover:border-purple-500/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-montserrat font-semibold text-white">
                  {month.month}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  month.trafficChange > 0 
                    ? 'bg-green-500/20 text-green-400' 
                    : month.trafficChange === 0 
                    ? 'bg-gray-500/20 text-gray-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {month.trafficChange > 0 ? '+' : ''}{month.trafficChange}%
                </span>
              </div>
              <div className="space-y-2">
                {month.focusKeywords.map((keyword, kIndex) => (
                  <div 
                    key={kIndex}
                    className="text-sm text-gray-300 font-poppins flex items-start gap-2"
                  >
                    <span className="text-purple-400 mt-1">•</span>
                    <span>{keyword}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default SEOAnalytics
