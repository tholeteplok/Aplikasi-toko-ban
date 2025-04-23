import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

function StatistikDashboard() {
  const [data, setData] = useState({
    harian: 0,
    mingguan: 0,
    bulanan: 0,
    tahunan: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      const now = new Date()
      const awalHari = new Date(now.setHours(0, 0, 0, 0)).toISOString()
      const awalMinggu = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const awalBulan = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const awalTahun = new Date(now.getFullYear(), 0, 1).toISOString()

      const [harian, mingguan, bulanan, tahunan] = await Promise.all([
        supabase
          .from('transaksi')
          .select('jumlah_total', { count: 'exact', head: false })
          .gte('created_at', awalHari),
        supabase
          .from('transaksi')
          .select('jumlah_total', { count: 'exact', head: false })
          .gte('created_at', awalMinggu),
        supabase
          .from('transaksi')
          .select('jumlah_total', { count: 'exact', head: false })
          .gte('created_at', awalBulan),
        supabase
          .from('transaksi')
          .select('jumlah_total', { count: 'exact', head: false })
          .gte('created_at', awalTahun),
      ])

      setData({
        harian: harian.count || 0,
        mingguan: mingguan.count || 0,
        bulanan: bulanan.count || 0,
        tahunan: tahunan.count || 0,
      })
    }

    fetchData()
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
      {[
        { label: 'Harian', value: data.harian },
        { label: 'Mingguan', value: data.mingguan },
        { label: 'Bulanan', value: data.bulanan },
        { label: 'Tahunan', value: data.tahunan },
      ].map((item) => (
        <div key={item.label} className="p-4 bg-white shadow rounded-xl text-center">
          <h3 className="text-sm font-medium text-gray-500">{item.label}</h3>
          <p className="text-xl font-bold text-blue-600">{item.value}</p>
        </div>
      ))}
    </div>
  )
}

export default StatistikDashboard
