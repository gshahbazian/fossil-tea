'use client'
import { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import LoginButton from 'src/components/LoginButton'
import SpotifyPlayer from 'src/components/SpotifyPlayer'
import supabase from 'src/services/supabase'

export default function Home() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.client.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.client.auth.onAuthStateChange((event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <div className="w-full max-w-2xl">
        <div className="mb-20">
          <LoginButton session={session} />
        </div>

        {session && <SpotifyPlayer session={session} />}
      </div>
    </main>
  )
}
