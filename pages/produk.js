import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import Layout from '../components/Layout'
import withAuth from '../utils/withAuth'

function Produk() {
  const [produk, setProduk] = useState([])
  const [kategori, setKategori] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchProduk()
  }, [kategori, search])

  const fetchProduk = async () => {
    let query = supabase.from('products').select()

    if (kategori) query = query.eq('kategori', kategori)
    if (search) query = query.ilike('nama', `%${search}%`)

    const { data } = await query
    setProduk(data || [])
  }

  const uniqueKategori = [...new Set(produk.map((p) => p.kategori))]

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-6 space-y-4">
        <h1 className="text-xl font-bold">Daftar Produk</h1>

        <div className="flex gap-4">
          <input
            type="text"
            className="border px-3 py-2 w-full"
            placeholder="Cari nama produk"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border px-3 py-2"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            {uniqueKategori.map((k, idx) => (
              <option key={idx} value={k}>{k}</option>
            ))}
          </select>
        </div>

        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">Kategori</th>
              <th className="p-2 border">Harga</th>
              <th className="p-2 border">Stok</th>
            </tr>
          </thead>
          <tbody>
            {produk.map((p) => (
              <tr key={p.id} className="text-center">
                <td className="p-2 border">{p.nama}</td>
                <td className="p-2 border">{p.kategori}</td>
                <td className="p-2 border">Rp {p.harga.toLocaleString()}</td>
                <td className="p-2 border">{p.stok}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default withAuth(Produk)


