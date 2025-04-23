import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Layout from '../components/Layout'
import withAuth from '../utils/withAuth'

function Dashboard() {
  const [data, setData] = useState([])
  const [range, setRange] = useState('harian')

  useEffect(() => {
    fetchData(range)
  }, [range])

  async function fetchData(jenis) {
    let query = supabase.from('transactions').select('*')
    const { data } = await query
    if (!data) return setData([])

    // Format tanggal & group data
    const grouped = {}

    data.forEach((t) => {
      const date = new Date(t.created_at)
      let key = ''

      if (jenis === 'harian') {
        key = date.toLocaleDateString('id-ID')
      } else if (jenis === 'mingguan') {
        const week = Math.ceil(date.getDate() / 7)
        key = `Minggu ${week} - ${date.getMonth() + 1}/${date.getFullYear()}`
      } else if (jenis === 'bulanan') {
        key = `${date.getMonth() + 1}/${date.getFullYear()}`
      } else if (jenis === 'tahunan') {
        key = `${date.getFullYear()}`
      }

      if (!grouped[key]) grouped[key] = 0
      grouped[key] += t.total
    })

    const chartData = Object.entries(grouped).map(([label, total]) => ({
      label,
      total
    }))

    setData(chartData)
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Statistik Penjualan</h1>

        <select
          className="mb-4 px-3 py-2 border rounded"
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          <option value="harian">Harian</option>
          <option value="mingguan">Mingguan</option>
          <option value="bulanan">Bulanan</option>
          <option value="tahunan">Tahunan</option>
        </select>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Layout>
  )
}

export default withAuth(Dashboard)

