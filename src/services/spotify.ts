/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: any
    Spotify: any
  }
}

export interface WebPlaybackTrack {
  uri: string
  id: string | null
  type: 'track' | 'episode' | 'ad'
  media_type: 'audio' | 'video'
  name: string
  is_playable: false
  album: {
    uri: string
    name: string
    images: { url: string }[]
  }
  artists: { uri: string; name: string }[]
}

export interface SpotifyWebPlaybackState {
  context: {
    uri: string | null
    metadata: any
  }
  disallows: {
    pausing: boolean
    peeking_next: boolean
    peeking_prev: boolean
    resuming: boolean
    seeking: boolean
    skipping_next: boolean
    skipping_prev: boolean
  }
  paused: boolean
  // The position_ms of the current track.
  position: number
  // The repeat mode. No repeat mode is 0,
  // repeat context is 1 and repeat track is 2.
  repeat_mode: number
  shuffle: boolean
  track_window: {
    current_track: WebPlaybackTrack | null
    previous_tracks: WebPlaybackTrack[]
    next_tracks: WebPlaybackTrack[]
  }
}

export function useSpotifyPlayer(props: { authToken: string }) {
  const { authToken } = props

  const [sdkIsReady, setSDKIsReady] = useState(false)

  const [player, setPlayer] = useState<any>(null)
  const [playerDeviceId, setPlayerDeviceId] = useState<string | null>(null)
  const [playerIsReady, setPlayerIsReady] = useState<boolean>(false)
  const [playerState, setPlayerState] =
    useState<SpotifyWebPlaybackState | null>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://sdk.scdn.co/spotify-player.js'
    script.async = true

    document.body.appendChild(script)

    window.onSpotifyWebPlaybackSDKReady = () => {
      setSDKIsReady(true)
    }
  }, [])

  useEffect(() => {
    if (!sdkIsReady) {
      return
    }

    const player = new window.Spotify.Player({
      name: 'Fossil Tea Player',
      getOAuthToken: (cb: any) => {
        cb(authToken)
      },
      volume: 0.5,
    })

    const onReady = ({ device_id }: { device_id: string }) => {
      console.log('Ready with Device ID', device_id)
      setPlayerDeviceId(device_id)
      setPlayerIsReady(true)

      player.getCurrentState().then(setPlayerState)
    }

    const onNotReady = ({ device_id }: { device_id: string }) => {
      console.log('Device ID has gone offline', device_id)
      setPlayerIsReady(false)
    }

    const onPlayerStateChanged = (playerState: SpotifyWebPlaybackState) => {
      console.log('state', playerState)
      setPlayerState(playerState)
    }

    player.addListener('ready', onReady)
    player.addListener('not_ready', onNotReady)
    player.addListener('player_state_changed', onPlayerStateChanged)

    player.connect()

    setPlayer(player)

    return () => {
      player.removeListener('ready', onReady)
      player.removeListener('not_ready', onNotReady)
      player.removeListener('player_state_changed', onPlayerStateChanged)
    }
  }, [authToken, sdkIsReady])

  return {
    sdkIsReady,
    player,
    playerDeviceId,
    playerIsReady,
    playerState,
  }
}
