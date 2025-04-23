import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../supabaseClient'
import Layout from '../components/Layout'
import withAuth from '../utils/withAuth'

function EditProduk() {
  const router = useRouter()
  const { id } = router.query
  const [form, setForm] = useState({
    nama: '',
    harga: 0,
    kategori: '',
    stok: 0,
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (id) fetchProduk()
  }, [id])

  const fetchProduk = async () => {
    const { data, error } = await supabase.from('products').select().eq('id', id).single()
    if (data) {
      setForm(data)
    } else {
      setMessage('Produk tidak ditemukan')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: name === 'harga' || name === 'stok' ? Number(value) : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('products').update(form).eq('id', id)
    if (!error) {
      setMessage('Produk berhasil diperbarui')
      setTimeout(() => router.push('/produk'), 1500)
    } else {
      setMessage('Gagal memperbarui produk')
    }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-6 space-y-4">
        <h1 className="text-xl font-bold">Edit Produk</h1>

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

          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Simpan Perubahan
          </button>
        </form>

        {message && <p className="text-center text-sm mt-2">{message}</p>}
      </div>
    </Layout>
  )
}

export default withAuth(EditProduk)
