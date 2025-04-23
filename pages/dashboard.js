import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import withAuth from '../utils/withAuth'

function Dashboard() {
  const [data, setData] = useState([])
  const [filter, setFilter] = useState('daily')

  useEffect(() => {
    fetchData(filter)
  }, [filter])

  async function fetchData(period) {
    let groupBy
    switch (period) {
      case 'weekly':
        groupBy = "DATE_TRUNC('week', created_at)"
        break
      case 'monthly':
        groupBy = "DATE_TRUNC('month', created_at)"
        break
      case 'yearly':
        groupBy = "DATE_TRUNC('year', created_at)"
        break
      default:
        groupBy = "DATE_TRUNC('day', created_at)"
    }

    const { data, error } = await supabase.rpc('get_sales_summary', { group_by: groupBy })

    if (!error) {
      const formatted = data.map((item) => ({
        date: new Date(item.period).toLocaleDateString('id-ID'),
        total: parseInt(item.total),
      }))
      setData(formatted)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Penjualan</h1>

      <div className="mb-4 space-x-2">
        {['daily', 'weekly', 'monthly', 'yearly'].map((opt) => (
          <button
            key={opt}
            onClick={() => setFilter(opt)}
            className={`px-4 py-2 rounded ${filter === opt ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {opt.toUpperCase()}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
          <Bar dataKey="total" fill="#60a5fa" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default withAuth(Dashboard)
