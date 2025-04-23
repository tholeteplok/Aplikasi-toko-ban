import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../supabaseClient'

export default function withAuth(Component) {
  return function ProtectedComponent(props) {
    const router = useRouter()

    useEffect(() => {
      const checkUser = async () => {
        const { data } = await supabase.auth.getSession()
        if (!data.session) {
          router.push('/login')
        }
      }
      checkUser()
    }, [])

    return <Component {...props} />
  }
}
