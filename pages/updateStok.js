import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import Layout from '../components/Layout'
import withAuth from '../utils/withAuth'

function UpdateStok() {
  const [produk, setProduk] = useState([])
  const [selected, setSelected] = useState(null)
  const [jumlah, setJumlah] = useState(0)
  const [tipe, setTipe] = useState('masuk')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchProduk()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const fetchProduk = async () => {
    const { data } = await supabase.from('products').select()
    setProduk(data || [])
  }

  const handleUpdate = async () => {
    if (!selected || jumlah <= 0) return

    const produk = await supabase
      .from('products')
      .select()
      .eq('id', selected)
      .single()

    if (!produk.data) return setMessage('Produk tidak ditemukan')

    const stokBaru = tipe === 'masuk'
      ? produk.data.stok + jumlah
      : produk.data.stok - jumlah

    if (stokBaru < 0) return setMessage('Stok tidak boleh negatif')

    // update stok
    await supabase
      .from('products')
      .update({ stok: stokBaru })
      .eq('id', selected)

    // insert log
    await supabase.from('stok_logs').insert([{
      produk_id: selected,
      jumlah,
      tipe,
      user_email: user?.email
    }])

    setMessage('Stok berhasil diperbarui')
    setJumlah(0)
    setSelected(null)
    setTipe('masuk')
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto space-y-4 mt-6">
        <h1 className="text-xl font-bold">Update Stok Manual</h1>

        <select
          className="w-full border p-2"
          value={selected || ''}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">-- Pilih Produk --</option>
          {produk.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nama} (stok: {p.stok})
            </option>
          ))}
        </select>

        <select
          className="w-full border p-2"
          value={tipe}
          onChange={(e) => setTipe(e.target.value)}
        >
          <option value="masuk">Masuk</option>
          <option value="keluar">Keluar</option>
        </select>

        <input
          type="number"
          className="w-full border p-2"
          placeholder="Jumlah"
          value={jumlah}
          onChange={(e) => setJumlah(Number(e.target.value))}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleUpdate}
        >
          Simpan
        </button>

        {message && <p className="text-sm text-center">{message}</p>}
      </div>
    </Layout>
  )
}

export default withAuth(UpdateStok)
