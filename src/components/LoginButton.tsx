import { Session } from '@supabase/supabase-js'
import supabase from 'src/services/supabase'

export default function LoginButton({ session }: { session: Session | null }) {
  const onClicked = async () => {
    if (session) {
      supabase.logout()
    } else {
      supabase.login()
    }
  }

  return (
    <button
      className=" bg-indigo-500 hover:bg-indigo-700 text-white font-semibold py-1 px-4 rounded-sm"
      onClick={onClicked}
    >
      {session ? 'Logout' : 'Login'}
    </button>
  )
}
