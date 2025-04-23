import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import withAuth from '../utils/withAuth'

function Transaksi() {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    fetchProducts()
    getUser()
  }, [])

  async function getUser() {
    const { data } = await supabase.auth.getUser()
    setUserId(data?.user?.id)
  }

  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*')
    if (!error) setProducts(data)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!selectedProduct || qty < 1 || !userId) return

    const product = products.find((p) => p.id === selectedProduct)
    const total = product.price * qty

    const { error } = await supabase.from('transactions').insert({
      user_id: userId,
      product_id: selectedProduct,
      qty,
      total_price: total,
    })

    if (error) {
      setError('Gagal simpan transaksi')
    } else {
      setSuccess('Transaksi berhasil disimpan!')
      setQty(1)
      setSelectedProduct(null)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Input Transaksi</h1>

      {success && <p className="text-green-600 mb-4">{success}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <select
          value={selectedProduct || ''}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Pilih Produk</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - Rp {product.price.toLocaleString('id-ID')}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="w-full p-2 border rounded"
          placeholder="Jumlah"
          required
        />

        <button
          type="submit"
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Simpan Transaksi
        </button>
      </form>
    </div>
  )
}

export default withAuth(Transaksi)
