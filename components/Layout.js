import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Layout({ children }) {
  const router = useRouter()

  const menu = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Transaksi', href: '/transaksi' },
    { name: 'Produk', href: '/produk' },
    { name: 'Riwayat', href: '/riwayat' },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 shadow-md hidden md:block">
        <h2 className="text-xl font-bold mb-6">Toko Ban</h2>
        <ul className="space-y-3">
          {menu.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <span
                  className={`block px-4 py-2 rounded ${
                    router.pathname === item.href
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'hover:bg-blue-100'
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={() => {
                localStorage.removeItem('token')
                router.push('/login')
              }}
              className="block px-4 py-2 mt-4 rounded bg-red-500 text-white w-full text-left"
            >
              Logout
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
