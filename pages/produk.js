import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import withAuth from '../utils/withAuth'
import Layout from '../components/Layout'

function Produk({ user }) {
  const [produk, setProduk] = useState([])
  const [nama, setNama] = useState('')
  const [merk, setMerk] = useState('')
  const [harga, setHarga] = useState('')

  useEffect(() => {
    fetchProduk()
  }, [])

  async function fetchProduk() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProduk(data)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const { error } = await supabase.from('products').insert([
      { name: nama, brand: merk, price: parseInt(harga) }
    ])
    if (!error) {
      setNama('')
      setMerk('')
      setHarga('')
      fetchProduk()
    }
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Input Produk</h1>
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block font-medium">Nama Produk</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Merk</label>
            <input
              type="text"
              value={merk}
              onChange={(e) => setMerk(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Harga</label>
            <input
              type="number"
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Simpan Produk
          </button>
        </form>

        <h2 className="text-xl font-semibold mb-3">Daftar Produk</h2>
        <ul className="space-y-2">
          {produk.map((item) => (
            <li key={item.id} className="p-3 border rounded bg-gray-50 flex justify-between">
              <span>{item.name} ({item.brand})</span>
              <span>Rp {item.price.toLocaleString('id-ID')}</span>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  )
}

export default withAuth(Produk)

