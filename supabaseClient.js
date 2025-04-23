// File: supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// File: pages/_app.js
import '@/styles/globals.css'
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}

// File: pages/index.js
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Dashboard() {
  const [data, setData] = useState({ daily: 0, weekly: 0, monthly: 0 })

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    // Dummy data. Replace with actual Supabase queries
    setData({ daily: 5000000, weekly: 25000000, monthly: 100000000 })
  }

  return (
    <div className="flex h-screen">
      <aside className="bg-gray-800 text-white w-64 p-4">
        <h1 className="text-xl font-bold mb-6">Toko Ban</h1>
        <nav className="space-y-4">
          <div>Dashboard</div>
          <div>Transaksi</div>
          <div>Stok</div>
          <div>Verifikasi</div>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50 p-6">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Penjualan Harian" amount={data.daily} color="bg-red-100" />
          <Card title="Penjualan Mingguan" amount={data.weekly} color="bg-yellow-100" />
          <Card title="Penjualan Bulanan" amount={data.monthly} color="bg-blue-100" />
        </div>
      </main>
    </div>
  )
}

function Card({ title, amount, color }) {
  return (
    <div className={`p-4 rounded-xl shadow-md ${color}`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-xl font-bold">Rp {amount.toLocaleString('id-ID')}</p>
    </div>
  )
}

// File: tailwind.config.js
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}

// File: .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
