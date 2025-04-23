import { useEffect, useState, useRef } from 'react'
import { supabase } from '../supabaseClient'
import withAuth from '../utils/withAuth'
import { useReactToPrint } from 'react-to-print'

function RiwayatTransaksi() {
  const [riwayat, setRiwayat] = useState([])
  const printRefs = useRef({})

  useEffect(() => {
    fetchRiwayat()
  }, [])

  async function fetchRiwayat() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, products(name, brand), users(full_name, role)')
      .order('created_at', { ascending: false })

    if (!error) setRiwayat(data)
  }

  const handlePrint = (id) => {
    const printRef = printRefs.current[id]
    const printWindow = window.open('', '', 'width=600,height=600')
    printWindow.document.write('<html><head><title>Cetak Struk</title></head><body>')
    printWindow.document.write(printRef.innerHTML)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 500)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Riwayat Transaksi</h1>

      <div className="space-y-6">
        {riwayat.map((item) => (
          <div key={item.id} className="border p-4 rounded shadow-sm relative bg-white">
            <div ref={(el) => (printRefs.current[item.id] = el)} className="print-area">
              <h2 className="text-lg font-bold mb-2">Toko Ban Sejahtera</h2>
              <p className="font-semibold">
                {item.products.name} ({item.products.brand})
              </p>
              <p>Jumlah: {item.qty}</p>
              <p>Total: Rp {item.total_price.toLocaleString('id-ID')}</p>
              <p className="text-sm text-gray-600 mt-2">
                Oleh: {item.users.full_name} ({item.users.role})<br />
                Waktu: {new Date(item.created_at).toLocaleString('id-ID')}
              </p>
            </div>
            <button
              onClick={() => handlePrint(item.id)}
              className="absolute top-2 right-2 text-sm bg-blue-600 text-white px-3 py-1 rounded"
            >
              Cetak
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default withAuth(RiwayatTransaksi)

