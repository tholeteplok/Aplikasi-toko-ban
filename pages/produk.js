// Tambahkan kolom Aksi di header
<thead>
  <tr className="bg-gray-100">
    <th className="p-2 border">Nama</th>
    <th className="p-2 border">Kategori</th>
    <th className="p-2 border">Harga</th>
    <th className="p-2 border">Stok</th>
    <th className="p-2 border">Aksi</th> {/* Tambahan */}
  </tr>
</thead>

// Tambahkan tombol Edit di tiap baris produk
<tbody>
  {produk.map((p) => (
    <tr key={p.id} className="text-center">
      <td className="p-2 border">{p.nama}</td>
      <td className="p-2 border">{p.kategori}</td>
      <td className="p-2 border">Rp {p.harga.toLocaleString()}</td>
      <td className="p-2 border">{p.stok}</td>
      <td className="p-2 border">
        <a
          href={`/editProduk?id=${p.id}`}
          className="text-blue-600 hover:underline"
        >
          Edit
        </a>
      </td>
    </tr>
  ))}
</tbody>



