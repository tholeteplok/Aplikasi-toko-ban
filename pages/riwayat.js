import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import Layout from '../components/Layout'
import withAuth from '../utils/withAuth'
import Link from 'next/link'

function Riwayat() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setData(data)
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Riwayat Transaksi</h1>
        <table className="w-full text-sm border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Tanggal</th>
              <th className="p-2 border">Kasir</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-2 border">
                  {new Date(item.created_at).toLocaleString('id-ID')}
                </td>
                <td className="p-2 border">{item.kasir}</td>
                <td className="p-2 border">Rp {item.total.toLocaleString('id-ID')}</td>
                <td className="p-2 border">
                  <Link href={`/print/${item.id}`}>
                    <span className="text-blue-600 hover:underline cursor-pointer">
                      Lihat & Cetak
                    </span>
                  </Link>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  Belum ada transaksi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default withAuth(Riwayat)


