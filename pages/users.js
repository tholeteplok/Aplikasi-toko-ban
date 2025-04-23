import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import Layout from '../components/Layout'
import withAuth from '../utils/withAuth'
import { useUser } from '../utils/UserContext'

function Users() {
  const [userList, setUserList] = useState([])
  const [message, setMessage] = useState('')
  const { userMetadata } = useUser()

  useEffect(() => {
    if (userMetadata?.role === 'owner') {
      fetchUsers()
    }
  }, [userMetadata])

  const fetchUsers = async () => {
    const { data } = await supabase.from('users').select()
    setUserList(data || [])
  }

  const handleRoleChange = async (id, role) => {
    const { error } = await supabase.from('users').update({ role }).eq('id', id)
    if (!error) {
      setMessage('Peran berhasil diperbarui')
      fetchUsers()
    } else {
      setMessage('Gagal memperbarui peran')
    }
  }

  if (userMetadata?.role !== 'owner') {
    return (
      <Layout>
        <p className="text-center mt-10">Hanya owner yang bisa mengakses halaman ini.</p>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-6 space-y-4">
        <h1 className="text-xl font-bold">Manajemen User</h1>
        {message && <p className="text-sm text-center">{message}</p>}

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Peran</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((u) => (
              <tr key={u.id} className="text-center">
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">{u.role}</td>
                <td className="p-2 border">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className="border p-1"
                  >
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                    <option value="kasir">Kasir</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default withAuth(Users)
