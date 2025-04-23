import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import withAuth from '../utils/withAuth'

function Verifikasi() {
  const [items, setItems] = useState([])

  useEffect(() => {
    fetchVerifications()
  }, [])

  async function fetchVerifications() {
    const { data } = await supabase
      .from('verifications')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    setItems(data)
  }

  async function handleApproval(id, approve = true) {
    const { data } = await supabase
      .from('verifications')
      .update({ status: approve ? 'approved' : 'rejected' })
      .eq('id', id)

    // Jika disetujui, apply datanya ke tabel terkait
    if (approve && data[0]?.type === 'stok') {
      const update = data[0].data
      await supabase
        .from('products')
        .update({ stock: update.newStock })
        .eq('id', update.productId)
    }

    fetchVerifications()
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Verifikasi Owner</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">Tidak ada data yang menunggu verifikasi.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="border p-4 rounded">
              <p className="font-semibold">Jenis: {item.type}</p>
              <pre className="text-sm text-gray-700 bg-gray-100 p-2 rounded mt-2">
                {JSON.stringify(item.data, null, 2)}
              </pre>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => handleApproval(item.id, true)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Setujui
                </button>
                <button
                  onClick={() => handleApproval(item.id, false)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Tolak
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default withAuth(Verifikasi)
