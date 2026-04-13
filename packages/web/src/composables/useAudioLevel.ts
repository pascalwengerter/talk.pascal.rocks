import { ref, onBeforeUnmount, watch, type Ref } from 'vue'

const SPEAKING_THRESHOLD = 15
const DEBOUNCE_MS = 200

let sharedAudioContext: AudioContext | null = null
let sharedContextRefCount = 0

function getSharedAudioContext(): AudioContext | null {
  if (!sharedAudioContext || sharedAudioContext.state === 'closed') {
    try {
      sharedAudioContext = new AudioContext()
    } catch {
      return null
    }
  }
  sharedContextRefCount++
  return sharedAudioContext
}

function releaseSharedAudioContext(): void {
  sharedContextRefCount--
  if (sharedContextRefCount <= 0) {
    sharedContextRefCount = 0
    if (sharedAudioContext && sharedAudioContext.state !== 'closed') {
      sharedAudioContext.close()
    }
    sharedAudioContext = null
  }
}

export function useAudioLevel(stream: Ref<MediaStream | null>) {
  const isSpeaking = ref(false)

  let analyser: AnalyserNode | null = null
  let source: MediaStreamAudioSourceNode | null = null
  let rafId: number | null = null
  let speakingTimeout: ReturnType<typeof setTimeout> | null = null
  let hasContext = false

  function cleanup() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    if (speakingTimeout !== null) {
      clearTimeout(speakingTimeout)
      speakingTimeout = null
    }
    source?.disconnect()
    source = null
    analyser = null
    if (hasContext) {
      releaseSharedAudioContext()
      hasContext = false
    }
    isSpeaking.value = false
  }

  function setup(mediaStream: MediaStream) {
    cleanup()

    const audioTracks = mediaStream.getAudioTracks()
    if (audioTracks.length === 0) return

    const audioContext = getSharedAudioContext()
    if (!audioContext) return
    hasContext = true

    source = audioContext.createMediaStreamSource(mediaStream)
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    source.connect(analyser)

    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    function poll() {
      if (!analyser) return
      analyser.getByteFrequencyData(dataArray)
      const sum = dataArray.reduce((a, b) => a + b, 0)
      const level = sum / dataArray.length

      if (level > SPEAKING_THRESHOLD) {
        isSpeaking.value = true
        if (speakingTimeout !== null) {
          clearTimeout(speakingTimeout)
        }
        speakingTimeout = setTimeout(() => {
          isSpeaking.value = false
        }, DEBOUNCE_MS)
      }

      rafId = requestAnimationFrame(poll)
    }

    poll()
  }

  watch(stream, (newStream) => {
    if (newStream) {
      setup(newStream)
    } else {
      cleanup()
    }
  }, { immediate: true })

  onBeforeUnmount(() => {
    cleanup()
  })

  return { isSpeaking }
}
