import { Session } from '@supabase/supabase-js'
import { useSpotifyPlayer } from 'src/services/spotify'

export default function SpotifyPlayer({ session }: { session: Session }) {
  const { player, playerIsReady, playerDeviceId, playerState } =
    useSpotifyPlayer({
      authToken: session.provider_token!,
    })

  if (!player || !playerIsReady) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h3>{playerState?.track_window.current_track?.name}</h3>
      <h3>{playerDeviceId}</h3>
    </div>
  )
}
