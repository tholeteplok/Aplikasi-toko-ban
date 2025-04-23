import Layout from '../components/Layout'
import withAuth from '../utils/withAuth'
import StatistikDashboard from '../components/StatistikDashboard'

function Dashboard() {
  return (
    <Layout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-gray-700">Dashboard</h1>

        {/* Statistik Penjualan */}
        <StatistikDashboard />

        {/* Konten tambahan lainnya bisa ditaruh di bawah sini */}
        <div className="mt-4">
          <p className="text-gray-600">Selamat datang di sistem manajemen transaksi toko ban.</p>
        </div>
      </div>
    </Layout>
  )
}

export default withAuth(Dashboard)
