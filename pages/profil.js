import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import Layout from '../components/Layout'
import withAuth from '../utils/withAuth'

function Profil() {
  const [user, setUser] = useState(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()
  }, [])

  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      setMessage('Password tidak cocok')
      return
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setMessage(`Gagal: ${error.message}`)
    } else {
      setMessage('Password berhasil diperbarui')
      setPassword('')
      setConfirmPassword('')
    }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">Profil</h1>

        {user && (
          <div className="space-y-4">
            <p><strong>Email:</strong> {user.email}</p>

            <div>
              <label className="block font-medium">Password Baru</label>
              <input
                type="password"
                className="border p-2 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium">Konfirmasi Password</label>
              <input
                type="password"
                className="border p-2 w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleChangePassword}
            >
              Simpan Password Baru
            </button>

            {message && <p className="text-sm text-center mt-2">{message}</p>}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default withAuth(Profil)
