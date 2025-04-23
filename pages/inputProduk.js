import { useState } from 'react'
import { supabase } from '../supabaseClient'
import Layout from '../components/Layout'
import withAuth from '../utils/withAuth'

function InputProduk() {
  const [nama, setNama] = useState('')
  const [stok, setStok] = useState(0)
  const [harga, setHarga] = useState(0)
  const [kategori, setKategori] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    const { error } = await supabase.from('products').insert([
      { nama, stok, harga, kategori }
    ])

    if (error) {
      setMessage('Gagal menambahkan produk')
    } else {
      setMessage('Produk berhasil ditambahkan')
      setNama('')
      setStok(0)
      setHarga(0)
      setKategori('')
    }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Input Produk</h1>
        <div className="space-y-4">
          <input
            className="w-full border p-2"
            placeholder="Nama Produk"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
          <input
            className="w-full border p-2"
            type="number"
            placeholder="Stok"
            value={stok}
            onChange={(e) => setStok(Number(e.target.value))}
          />
          <input
            className="w-full border p-2"
            type="number"
            placeholder="Harga"
            value={harga}
            onChange={(e) => setHarga(Number(e.target.value))}
          />
          <select
            className="w-full border p-2"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
          >
            <option value="">-- Pilih Kategori --</option>
            <option value="Ban">Ban</option>
            <option value="Oli">Oli</option>
            <option value="Aki">Aki</option>
            <option value="Lainnya">Lainnya</option>
          </select>

          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
            Simpan
          </button>

          {message && <p className="text-sm text-center">{message}</p>}
        </div>
      </div>
    </Layout>
  )
}

export default withAuth(InputProduk)
