import { SupabaseClient, createClient } from '@supabase/supabase-js'

class Supabase {
  client: SupabaseClient

  constructor() {
    this.client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!
    )
  }

  async login() {
    return await this.client.auth.signInWithOAuth({
      provider: 'spotify',
      options: {
        scopes:
          'user-read-email user-read-private user-read-playback-state user-modify-playback-state user-read-currently-playing streaming',
      },
    })
  }

  async logout() {
    return await this.client.auth.signOut()
  }
}

const supabase = new Supabase()
export default supabase
