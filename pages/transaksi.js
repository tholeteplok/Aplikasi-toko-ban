import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import Layout from '../components/Layout'
import withAuth from '../utils/withAuth'

function Transaksi() {
  const [produkList, setProdukList] = useState([])
  const [selectedProduk, setSelectedProduk] = useState('')
  const [jumlah, setJumlah] = useState(1)
  const [harga, setHarga] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProduk = async () => {
      const { data, error } = await supabase.from('stok').select('*')
      if (data) setProdukList(data)
    }
    fetchProduk()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const produk = produkList.find((p) => p.id === parseInt(selectedProduk))
    if (!produk) {
      alert('Produk tidak ditemukan')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('transaksi').insert([
      {
        produk_id: produk.id,
        nama_produk: produk.nama_produk,
        jumlah: jumlah,
        harga_satuan: harga,
        jumlah_total: jumlah * harga,
      },
    ])

    if (!error) {
      alert('Transaksi berhasil disimpan')
      setSelectedProduk('')
      setJumlah(1)
      setHarga(0)
    } else {
      alert('Terjadi kesalahan saat menyimpan transaksi')
    }
    setLoading(false)
  }

  return (
    <Layout>
      <div className="p-4 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-700">Input Transaksi Penjualan</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600">Produk</label>
            <select
              value={selectedProduk}
              onChange={(e) => setSelectedProduk(e.target.value)}
              required
              className="w-full border-gray-300 rounded p-2"
            >
              <option value="">Pilih Produk</option>
              {produkList.map((produk) => (
                <option key={produk.id} value={produk.id}>
                  {produk.nama_produk}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-600">Jumlah</label>
            <input
              type="number"
              value={jumlah}
              min="1"
              onChange={(e) => setJumlah(parseInt(e.target.value))}
              required
              className="w-full border-gray-300 rounded p-2"
            />
          </div>

          <div>
            <label className="block text-gray-600">Harga Satuan</label>
            <input
              type="number"
              value={harga}
              min="0"
              onChange={(e) => setHarga(parseInt(e.target.value))}
              required
              className="w-full border-gray-300 rounded p-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
          >
            {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
          </button>
        </form>
      </div>
    </Layout>
  )
}

export default withAuth(Transaksi)

