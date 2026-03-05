import { ref, computed } from 'vue'
import type { Track } from '@/config/playlist'

// Estado singleton – compartilhado entre todos os componentes
const _tracks = ref<Track[]>([])
const _currentIndex = ref(0)
const _isPlaying = ref(false)
const _volume = ref(0.7)
const _currentTime = ref(0)
const _duration = ref(0)
const _isMuted = ref(false)
const _isMinimized = ref(true)
const _showPlaylist = ref(false)

let _audio: HTMLAudioElement | null = null
let _initialized = false

function _initAudio() {
  if (_initialized || typeof window === 'undefined') return
  _initialized = true

  _audio = new Audio()
  _audio.volume = _volume.value

  _audio.addEventListener('timeupdate', () => {
    _currentTime.value = _audio!.currentTime
  })

  _audio.addEventListener('durationchange', () => {
    if (_audio!.duration && !isNaN(_audio!.duration)) {
      _duration.value = _audio!.duration
    }
  })

  _audio.addEventListener('ended', () => {
    _goNext()
  })

  _audio.addEventListener('error', () => {
    console.warn('[MusicPlayer] Erro ao carregar a faixa:', _audio?.src)
  })
}

function _loadTrack(index: number, autoPlay = false) {
  if (!_audio || !_tracks.value.length) return
  const track = _tracks.value[index]
  if (!track) return

  _audio.src = track.src
  _audio.load()
  _currentIndex.value = index
  _currentTime.value = 0
  _duration.value = 0

  if (autoPlay) {
    _audio.play()
      .then(() => { _isPlaying.value = true })
      .catch(() => { _isPlaying.value = false })
  }
}

function _goNext() {
  if (!_tracks.value.length) return
  const next = (_currentIndex.value + 1) % _tracks.value.length
  _loadTrack(next, _isPlaying.value)
}

function _shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function useMusicPlayer() {
  if (!_initialized) {
    _initAudio()
  }

  const currentTrack = computed(() => _tracks.value[_currentIndex.value] ?? null)
  const progress = computed(() =>
    _duration.value > 0 ? (_currentTime.value / _duration.value) * 100 : 0
  )

  function setPlaylist(newTracks: Track[], shuffle = false) {
    const ordered = shuffle ? _shuffle(newTracks) : newTracks
    _tracks.value = ordered
    if (ordered.length && _audio) {
      _audio.src = ordered[0].src
    }
  }

  function autoplayOnInteraction() {
    if (typeof window === 'undefined') return

    const handler = () => {
      if (!_isPlaying.value) {
        play()
      }
    }

    document.addEventListener('click', handler, { once: true })
    document.addEventListener('touchstart', handler, { once: true })
    document.addEventListener('keydown', handler, { once: true })
    document.addEventListener('wheel', handler, { once: true, passive: true })
    window.addEventListener('scroll', handler, { once: true, passive: true })
  }

  async function play() {
    if (!_audio) return
    if (!_audio.src && _tracks.value.length) {
      _audio.src = _tracks.value[_currentIndex.value].src
    }
    try {
      await _audio.play()
      _isPlaying.value = true
    } catch {
      _isPlaying.value = false
    }
  }

  function pause() {
    _audio?.pause()
    _isPlaying.value = false
  }

  function toggle() {
    _isPlaying.value ? pause() : play()
  }

  function next() {
    const nextIdx = (_currentIndex.value + 1) % _tracks.value.length
    _loadTrack(nextIdx, _isPlaying.value)
  }

  function prev() {
    if (_currentTime.value > 3) {
      if (_audio) _audio.currentTime = 0
      return
    }
    const prevIdx = (_currentIndex.value - 1 + _tracks.value.length) % _tracks.value.length
    _loadTrack(prevIdx, _isPlaying.value)
  }

  function seek(percent: number) {
    if (!_audio || !_duration.value) return
    _audio.currentTime = (percent / 100) * _duration.value
  }

  function setVolume(val: number) {
    _volume.value = val
    if (_audio) _audio.volume = val
    if (val > 0) _isMuted.value = false
  }

  function toggleMute() {
    if (!_audio) return
    _isMuted.value = !_isMuted.value
    _audio.muted = _isMuted.value
  }

  function playTrack(index: number) {
    _loadTrack(index, true)
  }

  function formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds) || !isFinite(seconds)) return '0:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return {
    tracks: _tracks,
    currentIndex: _currentIndex,
    currentTrack,
    isPlaying: _isPlaying,
    volume: _volume,
    currentTime: _currentTime,
    duration: _duration,
    progress,
    isMuted: _isMuted,
    isMinimized: _isMinimized,
    showPlaylist: _showPlaylist,
    setPlaylist,
    autoplayOnInteraction,
    play,
    pause,
    toggle,
    next,
    prev,
    seek,
    setVolume,
    toggleMute,
    playTrack,
    formatTime,
  }
}
