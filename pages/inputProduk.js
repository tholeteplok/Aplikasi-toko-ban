// Tambahan import:
import { useEffect } from 'react'

function InputProduk() {
  const [user, setUser] = useState(null)
  // ...

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const handleSubmit = async () => {
    const { data, error } = await supabase
      .from('products')
      .insert([{ nama, stok, harga, kategori }])
      .select()
      .single()

    if (error || !data) {
      setMessage('Gagal menambahkan produk')
      return
    }

    // Insert ke stok_logs
    await supabase.from('stok_logs').insert([{
      produk_id: data.id,
      jumlah: stok,
      tipe: 'masuk',
      user_email: user?.email,
    }])

    setMessage('Produk berhasil ditambahkan')
    setNama('')
    setStok(0)
    setHarga(0)
    setKategori('')
  }

  // ...
}

