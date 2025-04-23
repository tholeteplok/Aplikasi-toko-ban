import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import withAuth from '../utils/withAuth'

function RiwayatTransaksi() {
  const [riwayat, setRiwayat] = useState([])

  useEffect(() => {
    fetchRiwayat()
  }, [])

  async function fetchRiwayat() {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id, qty, total_price, created_at,
        users ( full_name, role ),
        products ( name, brand )
      `)
      .order('created_at', { ascending: false })

    if (!error) setRiwayat(data)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Riwayat Transaksi</h1>

      <div className="space-y-4">
        {riwayat.map((item) => (
          <div key={item.id} className="border p-4 rounded shadow-sm">
            <p className="font-semibold">{item.products.name} ({item.products.brand})</p>
            <p>Jumlah: {item.qty}</p>
            <p>Total: Rp {item.total_price.toLocaleString('id-ID')}</p>
            <p className="text-sm text-gray-500">
              Oleh: {item.users.full_name} ({item.users.role}) | {new Date(item.created_at).toLocaleString('id-ID')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default withAuth(RiwayatTransaksi)
