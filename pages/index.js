import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import withAuth from '../utils/withAuth'

function Dashboard() {
  const [data, setData] = useState({ daily: 0, weekly: 0, monthly: 0 })
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchStats()
    getUser()
  }, [])

  async function fetchStats() {
    // Dummy data. Replace with actual Supabase queries
    setData({ daily: 5000000, weekly: 25000000, monthly: 100000000 })
  }

  async function getUser() {
    const { data } = await supabase.auth.getUser()
    setUser(data?.user)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
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
        <div className="absolute bottom-4 left-4 text-sm">
          {user && (
            <>
              <p>{user.email}</p>
              <button
                onClick={handleLogout}
                className="mt-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
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

export default withAuth(Dashboard)
