import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import Layout from '../components/Layout'
import withAuth from '../utils/withAuth'

function RiwayatStok() {
  const [riwayat, setRiwayat] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('riwayat_stok')
        .select(`id, jumlah, jenis, created_at, products (nama)`)
        .order('created_at', { ascending: false })

      if (!error) setRiwayat(data)
    }

    fetchData()
  }, [])

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-6">
        <h1 className="text-xl font-bold mb-4">Riwayat Stok Barang</h1>

        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Tanggal</th>
              <th className="p-2 border">Produk</th>
              <th className="p-2 border">Jenis</th>
              <th className="p-2 border">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {riwayat.map((item) => (
              <tr key={item.id}>
                <td className="p-2 border">{new Date(item.created_at).toLocaleString()}</td>
                <td className="p-2 border">{item.products.nama}</td>
                <td className={`p-2 border ${item.jenis === 'masuk' ? 'text-green-600' : 'text-red-600'}`}>
                  {item.jenis}
                </td>
                <td className="p-2 border">{item.jumlah}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default withAuth(RiwayatStok)

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-6">
        <h1 className="text-2xl font-bold mb-4">Riwayat Stok Masuk / Keluar</h1>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Tanggal</th>
              <th className="p-2 border">Produk</th>
              <th className="p-2 border">Tipe</th>
              <th className="p-2 border">Jumlah</th>
              <th className="p-2 border">User</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="p-2 border">{new Date(log.tanggal).toLocaleString('id-ID')}</td>
                <td className="p-2 border">{log.products?.nama}</td>
                <td className={`p-2 border ${log.tipe === 'masuk' ? 'text-green-600' : 'text-red-600'}`}>{log.tipe}</td>
                <td className="p-2 border">{log.jumlah}</td>
                <td className="p-2 border">{log.user_email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default withAuth(RiwayatStok)
