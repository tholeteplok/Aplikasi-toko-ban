import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import withAuth from '../utils/withAuth'

function Produk() {
  const [products, setProducts] = useState([])
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name || !brand || !price || !stock) return

    if (editingId) {
      await supabase.from('products').update({
        name, brand, price: Number(price), stock: Number(stock)
      }).eq('id', editingId)
    } else {
      await supabase.from('products').insert({
        name, brand, price: Number(price), stock: Number(stock)
      })
    }

    resetForm()
    fetchProducts()
  }

  function resetForm() {
    setName('')
    setBrand('')
    setPrice('')
    setStock('')
    setEditingId(null)
  }

  async function handleEdit(product) {
    setName(product.name)
    setBrand(product.brand)
    setPrice(product.price)
    setStock(product.stock)
    setEditingId(product.id)
  }

  async function handleDelete(id) {
    if (confirm('Yakin ingin hapus produk ini?')) {
      await supabase.from('products').delete().eq('id', id)
      fetchProducts()
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Manajemen Produk</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6 max-w-xl">
        <input
          type="text"
          placeholder="Nama Produk"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Merek (Bridgestone, GT, Dunlop)"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Harga"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Stok"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {editingId ? 'Update Produk' : 'Tambah Produk'}
        </button>
      </form>

      <div className="grid gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{product.name}</p>
              <p className="text-sm text-gray-500">
                {product.brand} - Rp {product.price.toLocaleString('id-ID')} | Stok: {product.stock}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(product)}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="text-red-500 hover:underline"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default withAuth(Produk)
