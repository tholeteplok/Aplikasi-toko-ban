// Aplikasi-toko-ban/pages/transaksi.js

import { useState } from 'react'
import { supabase } from '../supabaseClient'
import Layout from '../components/Layout'
import withAuth from '../utils/withAuth'

function Transaksi() {
  const [barang, setBarang] = useState('')
  const [jumlah, setJumlah] = useState(1)
  const [hargaSatuan, setHargaSatuan] = useState(0)
  const [kasir, setKasir] = useState('')
  const [loading, setLoading] = useState(false)

  const totalHarga = jumlah * hargaSatuan

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('transactions').insert([
      {
        barang,
        jumlah,
        harga_satuan: hargaSatuan,
        total: totalHarga,
        kasir,
      }
    ])

    setLoading(false)

    if (!error) {
      alert('Transaksi berhasil disimpan!')
      setBarang('')
      setJumlah(1)
      setHargaSatuan(0)
      setKasir('')
    } else {
      alert('Gagal menyimpan transaksi.')
    }
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Input Transaksi Baru</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Nama Barang</label>
            <input
              type="text"
              value={barang}
              onChange={(e) => setBarang(e.target.value)}
              required
              className="w-full border rounded p-2"
              placeholder="Contoh: Ban Bridgestone 185/70R14"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Jumlah</label>
            <input
              type="number"
              value={jumlah}
              min="1"
              onChange={(e) => setJumlah(parseInt(e.target.value))}
              required
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Harga Satuan (Rp)</label>
            <input
              type="number"
              value={hargaSatuan}
              min="0"
              onChange={(e) => setHargaSatuan(parseInt(e.target.value))}
              required
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Total Harga</label>
            <input
              type="text"
              value={`Rp ${totalHarga.toLocaleString('id-ID')}`}
              readOnly
              className="w-full border rounded p-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Kasir</label>
            <input
              type="text"
              value={kasir}
              onChange={(e) => setKasir(e.target.value)}
              required
              className="w-full border rounded p-2"
              placeholder="Nama kasir login"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
          </button>
        </form>
      </div>
    </Layout>
  )
}

export default withAuth(Transaksi)


