import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import withAuth from '../utils/withAuth'
import { useRouter } from 'next/router'

function RegisterUser() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('admin')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    getUser()
  }, [])

  async function getUser() {
    const { data } = await supabase.auth.getUser()
    setUser(data?.user)
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profile?.role !== 'owner') {
      router.push('/')
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password
    })

    if (signupError) {
      setError(signupError.message)
      return
    }

    const newUser = data.user
    if (newUser) {
      const { error: insertError } = await supabase.from('users').insert({
        id: newUser.id,
        email: newUser.email,
        role
      })

      if (insertError) {
        setError(insertError.message)
      } else {
        setSuccess('User berhasil dibuat!')
        setEmail('')
        setPassword('')
      }
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Buat Akun Baru</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

        <input
          type="email"
          placeholder="Email user baru"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded"
        >
          <option value="admin">Admin</option>
          <option value="kasir">Kasir</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Buat Akun
        </button>
      </form>
    </div>
  )
}

export default withAuth(RegisterUser)
