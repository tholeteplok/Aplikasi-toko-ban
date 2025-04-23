import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../supabaseClient'
import Layout from '../components/Layout'
import withAuth from '../utils/withAuth'

function InputStok() {
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

    // Tambahkan ke riwayat stok
    const { error: riwayatError } = await supabase.from('riwayat_stok').insert([
      {
        produk_id: selectedId,
        jumlah: parseInt(jumlah),
        jenis: 'masuk',
      },
    ])

    // Update stok produk
    const { error: updateError } = await supabase.rpc('tambah_stok', {
      id_produk: selectedId,
      jumlah_masuk: parseInt(jumlah),
    })

    if (!riwayatError && !updateError) {
      setMessage('Stok berhasil ditambahkan')
      setTimeout(() => router.push('/riwayatStok'), 1500)
    } else {
      setMessage('Gagal menambahkan stok')
    }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-6 space-y-4">
        <h1 className="text-xl font-bold">Input Stok Masuk</h1>

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
            placeholder="Jumlah Masuk"
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Tambah
          </button>
        </form>

        {message && <p className="text-center text-sm">{message}</p>}
      </div>
    </Layout>
  )
}

export default withAuth(InputStok)
