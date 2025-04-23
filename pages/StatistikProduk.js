import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import Layout from '../components/Layout'
import withAuth from '../utils/withAuth'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const getRangeDate = (filter) => {
  const now = new Date()
  let from = new Date()
  if (filter === 'hari') from.setHours(0, 0, 0, 0)
  if (filter === 'minggu') from.setDate(now.getDate() - 7)
  if (filter === 'bulan') from.setMonth(now.getMonth() - 1)
  if (filter === 'tahun') from.setFullYear(now.getFullYear() - 1)
  return from.toISOString()
}

function StatistikProduk() {
  const [filter, setFilter] = useState('bulan')
  const [data, setData] = useState([])

  useEffect(() => {
    fetchData()
  }, [filter])

  const fetchData = async () => {
    const fromDate = getRangeDate(filter)

    const { data: transaksi, error } = await supabase
      .from('riwayat_transaksi')
      .select('produk_id, jumlah, products(nama)')
      .gte('tanggal', fromDate)

    if (error || !transaksi) return

    const grouped = {}
    transaksi.forEach((t) => {
      const nama = t.products?.nama || 'Tidak diketahui'
      if (!grouped[nama]) grouped[nama] = 0
      grouped[nama] += t.jumlah
    })

    const chartData = Object.entries(grouped).map(([nama, jumlah]) => ({
      nama,
      jumlah,
    }))

    setData(chartData)
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Statistik Produk Terlaris</h1>
          <select
            className="border p-2 rounded"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="hari">Hari Ini</option>
            <option value="minggu">Minggu Ini</option>
            <option value="bulan">Bulan Ini</option>
            <option value="tahun">Tahun Ini</option>
          </select>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="nama" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="jumlah" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Layout>
  )
}

export default withAuth(StatistikProduk)
