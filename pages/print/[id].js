import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../supabaseClient'

export default function PrintTransaksi() {
  const router = useRouter()
  const { id } = router.query
  const [transaksi, setTransaksi] = useState(null)

  useEffect(() => {
    if (id) {
      fetchData()
    }
  }, [id])

  async function fetchData() {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single()

    setTransaksi(data)
  }

  if (!transaksi) return <p className="p-4">Memuat...</p>

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-300 mt-8 text-sm print:text-xs">
      <h1 className="text-center font-bold text-lg mb-4">Toko Ban Jaya</h1>

      <div className="mb-4">
        <p><strong>ID Transaksi:</strong> {transaksi.id}</p>
        <p><strong>Tanggal:</strong> {new Date(transaksi.created_at).toLocaleString('id-ID')}</p>
        <p><strong>Kasir:</strong> {transaksi.kasir}</p>
      </div>

      <div className="mb-4">
        <p><strong>Produk:</strong></p>
        <pre className="whitespace-pre-wrap bg-gray-50 p-2 rounded border">{transaksi.produk}</pre>
      </div>

      <div className="mb-4">
        <p><strong>Total:</strong> Rp {transaksi.total.toLocaleString('id-ID')}</p>
      </div>

      <button
        onClick={() => window.print()}
        className="bg-blue-600 text-white px-4 py-2 mt-4 w-full print:hidden"
      >
        Cetak
      </button>
    </div>
  )
}
