export function attachMediaStream(
  element: HTMLMediaElement,
  stream: MediaStream | null,
  muted = false,
): void {
  if (stream) {
    if (muted) {
      element.muted = true
    }
    element.srcObject = stream
    if (element.paused) {
      element.play().catch((e) => {
        console.warn('autoplay blocked:', e.message)
      })
    }
  } else {
    if (element.srcObject) {
      element.pause()
    }
    element.srcObject = null
    element.muted = false
  }
}

export function browserCanUseWebrtc(): boolean {
  try {
    const pc = new RTCPeerConnection({ iceServers: [] })
    pc.close()
  } catch {
    return false
  }

  return !!(
    window.RTCPeerConnection &&
    window.RTCIceCandidate &&
    window.RTCSessionDescription &&
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia
  )
}
