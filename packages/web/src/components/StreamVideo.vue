<template>
  <video
    ref="videoEl"
    autoplay
    playsinline
    :class="{
      'media max-h-full max-w-full bg-black': status === 'video',
      'h-0 w-0 absolute': status !== 'video',
    }"
    @click="emit('click')"
    @keypress.enter="emit('click')"
  />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import type { Peer } from '@palava/client'
import { attachMediaStream } from '@palava/client'

const props = defineProps<{
  peer: Peer
  status: string
  muted?: boolean
  requestFullscreen?: string | null
}>()

const emit = defineEmits<{ click: [] }>()

const videoEl = ref<HTMLVideoElement>()
const attached = ref(false)

function isMutedState(): boolean {
  return props.peer.isMuted() || props.peer.isLocal() || !!props.muted
}

function attachPeerStream() {
  if (!videoEl.value) return
  attachMediaStream(videoEl.value, props.peer.getStream(), isMutedState())
  attached.value = true
}

function onStreamReady() {
  attachPeerStream()
}

function onStreamRemoved() {
  if (!videoEl.value) return
  attachMediaStream(videoEl.value, null)
  attached.value = false
}

function onVideoRemoved() {
  if (!videoEl.value) return
  const stream = props.peer.getStream()
  if (stream && stream.getVideoTracks().length === 0) {
    attachMediaStream(videoEl.value, null)
    attached.value = false
  }
}

function onVideoAdded() {
  attachPeerStream()
}

onMounted(() => {
  props.peer.on('stream_ready', onStreamReady)
  props.peer.on('stream_removed', onStreamRemoved)
  props.peer.on('video_removed', onVideoRemoved)
  props.peer.on('video_added', onVideoAdded)
  if (props.peer.isReady()) {
    attachPeerStream()
  }
})

onBeforeUnmount(() => {
  props.peer.off('stream_ready', onStreamReady)
  props.peer.off('stream_removed', onStreamRemoved)
  props.peer.off('video_removed', onVideoRemoved)
  props.peer.off('video_added', onVideoAdded)
})

watch(() => props.status, (newStatus) => {
  if (newStatus === 'video') {
    attachPeerStream()
  }
})

watch(() => props.requestFullscreen, () => {
  videoEl.value?.requestFullscreen?.()
})

watch(() => props.muted, (newMuteStatus) => {
  if (videoEl.value) {
    videoEl.value.muted = !!newMuteStatus
  }
})
</script>
