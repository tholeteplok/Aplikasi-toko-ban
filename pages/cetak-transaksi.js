import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

function CetakTransaksi() {
  const router = useRouter()
  const { id } = router.query
  const [transaksi, setTransaksi] = useState(null)

  useEffect(() => {
    if (id) {
      const fetchTransaksi = async () => {
        const { data, error } = await supabase
          .from('transaksi')
          .select('*')
          .eq('id', id)
          .single()

        if (data) setTransaksi(data)
      }
      fetchTransaksi()
    }
  }, [id])

  useEffect(() => {
    if (transaksi) {
      setTimeout(() => {
        window.print()
      }, 500)
    }
  }, [transaksi])

  if (!transaksi) return <div>Memuat...</div>

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto border p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Nota Transaksi</h1>
        <div className="space-y-2">
          <p><strong>Nama Produk:</strong> {transaksi.nama_produk}</p>
          <p><strong>Jumlah:</strong> {transaksi.jumlah}</p>
          <p><strong>Harga Satuan:</strong> Rp {transaksi.harga_satuan.toLocaleString('id-ID')}</p>
          <p><strong>Total:</strong> Rp {transaksi.jumlah_total.toLocaleString('id-ID')}</p>
          <p><strong>Tanggal:</strong> {new Date(transaksi.created_at).toLocaleString('id-ID')}</p>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          Terima kasih telah berbelanja
        </div>
      </div>
    </div>
  )
}

export default CetakTransaksi
