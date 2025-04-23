import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import Layout from '../components/Layout'
import withAuth from '../utils/withAuth'

function Verifikasi() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('status_verifikasi', 'pending')
      .order('created_at', { ascending: false })

    setData(data)
  }

  async function updateStatus(id, status) {
    await supabase
      .from('transactions')
      .update({ status_verifikasi: status })
      .eq('id', id)

    fetchData()
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Verifikasi Transaksi</h1>
        {data.length === 0 ? (
          <p className="text-gray-500">Tidak ada transaksi yang perlu diverifikasi.</p>
        ) : (
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
                  <td className="p-2 border">{new Date(item.created_at).toLocaleString('id-ID')}</td>
                  <td className="p-2 border">{item.kasir}</td>
                  <td className="p-2 border">Rp {item.total.toLocaleString('id-ID')}</td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => updateStatus(item.id, 'disetujui')}
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Setujui
                    </button>
                    <button
                      onClick={() => updateStatus(item.id, 'ditolak')}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Tolak
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  )
}

export default withAuth(Verifikasi)

