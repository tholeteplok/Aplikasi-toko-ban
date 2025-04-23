import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../supabaseClient'
import Layout from '../components/Layout'
import withAuth from '../utils/withAuth'

function TambahProduk() {
  const router = useRouter()
  const [form, setForm] = useState({
    nama: '',
    harga: '',
    kategori: '',
    stok: '',
  })
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { nama, harga, kategori, stok } = form
    if (!nama || !harga || !kategori || !stok) {
      setMessage('Semua field wajib diisi')
      return
    }

    const { error } = await supabase.from('products').insert([
      {
        nama,
        harga: parseInt(harga),
        kategori,
        stok: parseInt(stok),
      },
    ])

    if (!error) {
      setMessage('Produk berhasil ditambahkan')
      setTimeout(() => router.push('/produk'), 1500)
    } else {
      setMessage('Gagal menambahkan produk')
    }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-6 space-y-4">
        <h1 className="text-xl font-bold">Tambah Produk</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="nama"
            type="text"
            placeholder="Nama Produk"
            value={form.nama}
            onChange={handleChange}
            className="w-full border p-2"
          />
          <input
            name="kategori"
            type="text"
            placeholder="Kategori"
            value={form.kategori}
            onChange={handleChange}
            className="w-full border p-2"
          />
          <input
            name="harga"
            type="number"
            placeholder="Harga"
            value={form.harga}
            onChange={handleChange}
            className="w-full border p-2"
          />
          <input
            name="stok"
            type="number"
            placeholder="Stok"
            value={form.stok}
            onChange={handleChange}
            className="w-full border p-2"
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Tambah
          </button>
        </form>

        {message && <p className="text-center text-sm mt-2">{message}</p>}
      </div>
    </Layout>
  )
}

export default withAuth(TambahProduk)
