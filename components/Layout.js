import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Layout({ children }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const menu = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Transaksi', href: '/transaksi' },
    { name: 'Produk', href: '/produk' },
    { name: 'Riwayat', href: '/riwayat' },
  ]

  function handleLogout() {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Toggle Button for Mobile */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden bg-blue-600 text-white px-4 py-2"
      >
        ☰ Menu
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-gray-100 p-4 shadow-md md:block w-full md:w-64 ${
          open ? 'block' : 'hidden'
        }`}
      >
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
              onClick={handleLogout}
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

