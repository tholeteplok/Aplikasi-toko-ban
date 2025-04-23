import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../supabaseClient'

export default function withRole(Component, allowedRoles = []) {
  return function RoleProtected(props) {
    const router = useRouter()
    const [authorized, setAuthorized] = useState(null)

    useEffect(() => {
      async function checkRole() {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        const { data: { user } } = await supabase.auth.getUser()
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        if (allowedRoles.includes(profile.role)) {
          setAuthorized(true)
        } else {
          setAuthorized(false)
        }
      }

      checkRole()
    }, [])

    if (authorized === null) return <p className="p-4">Loading...</p>
    if (authorized === false) return <p className="p-4 text-red-500">Akses ditolak. Anda tidak punya hak akses ke halaman ini.</p>

    return <Component {...props} />
  }
}
