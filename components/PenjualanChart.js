import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'
import { supabase } from '../supabaseClient'
import { format, subDays } from 'date-fns'

function PenjualanChart() {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchChartData = async () => {
      const today = new Date()
      const dateArray = [...Array(7)].map((_, i) => subDays(today, 6 - i))
      const formatted = dateArray.map((d) => format(d, 'yyyy-MM-dd'))

      let newData = []

      for (const tanggal of formatted) {
        const { data: transaksi } = await supabase
          .from('transaksi')
          .select('jumlah_total')
          .gte('created_at', `${tanggal}T00:00:00`)
          .lte('created_at', `${tanggal}T23:59:59`)

        const total = transaksi?.reduce((acc, cur) => acc + cur.jumlah_total, 0) || 0
        newData.push({ tanggal, total })
      }

      setData(newData)
    }

    fetchChartData()
  }, [])

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Grafik Penjualan (7 Hari Terakhir)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis dataKey="tanggal" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PenjualanChart
