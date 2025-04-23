import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../supabaseClient'
import Layout from '../components/Layout'
import withAuth from '../utils/withAuth'

function StokKeluar() {
  const [produk, setProduk] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [jumlah, setJumlah] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchProduk = async () => {
      const { data, error } = await supabase.from('products').select('*')
      if (!error) setProduk(data)
    }
    fetchProduk()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedId || !jumlah) {
      setMessage('Pilih produk dan masukkan jumlah')
      return
    }

    // Tambah ke riwayat stok
    const { error: riwayatError } = await supabase.from('riwayat_stok').insert([
      {
        produk_id: selectedId,
        jumlah: parseInt(jumlah),
        jenis: 'keluar',
      },
    ])

    // Update stok produk (kurangi)
    const { error: updateError } = await supabase.rpc('kurangi_stok', {
      id_produk: selectedId,
      jumlah_keluar: parseInt(jumlah),
    })

    if (!riwayatError && !updateError) {
      setMessage('Stok berhasil dikurangi')
      setTimeout(() => router.push('/riwayatStok'), 1500)
    } else {
      setMessage('Gagal mengurangi stok')
    }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-6 space-y-4">
        <h1 className="text-xl font-bold">Stok Keluar</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <select
            className="w-full border p-2"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">-- Pilih Produk --</option>
            {produk.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama}
              </option>
            ))}
          </select>

          <input
            type="number"
            className="w-full border p-2"
            placeholder="Jumlah Keluar"
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
          />

          <button className="bg-red-600 text-white px-4 py-2 rounded">
            Kurangi
          </button>
        </form>

        {message && <p className="text-center text-sm">{message}</p>}
      </div>
    </Layout>
  )
}

export default withAuth(StokKeluar)
