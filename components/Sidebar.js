import Link from 'next/link'
import { useRouter } from 'next/router'

const Sidebar = () => {
  const router = useRouter()
  const menu = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Transaksi', path: '/transaksi' },
    { name: 'Input Stok', path: '/inputStok' },         // ✅ New
    { name: 'Stok Keluar', path: '/stokKeluar' },       // ✅ New
    { name: 'Riwayat Stok', path: '/riwayatStok' },     // ✅ New
    { name: 'Riwayat Transaksi', path: '/riwayat' },
    { name: 'Verifikasi', path: '/verifikasi' },
    { name: 'Manajemen User', path: '/manajemenUser' },
  ]

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Toko Ban</h2>
      <nav className="space-y-2">
        {menu.map((item) => (
          <Link key={item.path} href={item.path}>
            <div
              className={`block p-2 rounded hover:bg-gray-700 cursor-pointer ${
                router.pathname === item.path ? 'bg-gray-700' : ''
              }`}
            >
              {item.name}
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
