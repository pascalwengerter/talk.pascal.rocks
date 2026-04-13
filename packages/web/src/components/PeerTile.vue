<template>
  <li class="relative overflow-hidden bg-neutral-800">
    <div v-show="isSpeaking" class="pointer-events-none absolute inset-0 z-50 border-4 border-green-400" />
    <span
      v-if="peer.isReady()"
      :class="[
        'absolute top-2 left-2 z-50 h-2.5 w-2.5 rounded-full border-2 border-black/30',
        presenceState === 'online' ? 'bg-green-400' :
        presenceState === 'away' ? 'bg-amber-400' : 'bg-gray-400'
      ]"
      :title="presenceTitle"
    />

    <PeerStatusIndicator
      v-if="status !== 'video'"
      :status="status"
      :error="peer.error"
      @click="togglePeerMenu()"
    />

    <video
      ref="videoEl"
      autoplay
      playsinline
      :class="[
        'h-full w-full object-cover',
        { '-scale-x-100': peer.isLocal() },
      ]"
      v-show="status === 'video'"
      @click="togglePeerMenu()"
    />

    <transition name="fade-control">
      <NetworkInfoPanel
        v-if="networkInfoActive && !peer.isLocal()"
        @close="hideNetworkInfo()"
        @open-info-screen="(page) => emit('open-info-screen', page)"
        :peer="(peer as RemotePeer)"
      />
    </transition>

    <nav class="absolute inset-x-0 bottom-1 z-30 flex flex-row-reverse flex-wrap-reverse items-center justify-start">
      <template v-for="btn in menuButtons" :key="btn.key">
        <transition name="fade-control">
          <button
            v-if="btn.show"
            :title="btn.title"
            class="m-0.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-none bg-black/40 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/60 sm:h-8 sm:w-8"
            @click="btn.action"
          >
            <component :is="btn.icon" class="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4" />
          </button>
        </transition>
      </template>
    </nav>
  </li>
</template>

<script setup lang="ts">
import { ref, computed, markRaw, onMounted, onBeforeUnmount, triggerRef, type Component } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Peer, RemotePeer, RemotePeerEvents } from '@palava/client'
import { useAudioLevel } from '@/composables/useAudioLevel'
import { attachMediaStream } from '@palava/client'
import PeerStatusIndicator from '@/components/PeerStatusIndicator.vue'
import NetworkInfoPanel from '@/components/NetworkInfoPanel.vue'
import LevelUpIcon from '@/assets/icons/level-up.svg?component'
import LevelDownIcon from '@/assets/icons/level-down.svg?component'
import ResizeIcon from '@/assets/icons/resize-full-screen.svg?component'
import NetworkIcon from '@/assets/icons/network.svg?component'
import VolumeOffIcon from '@/assets/icons/volume-off.svg?component'
import VolumeUpIcon from '@/assets/icons/volume-up.svg?component'

const props = defineProps<{
  peer: Peer
  colorIndex?: number
  type: 'stage' | 'lobby'
  partyMode: 'landscape' | 'portrait'
  stageMode: 'landscape' | 'portrait'
}>()

const emit = defineEmits<{
  togglePeer: []
  'open-info-screen': [page: string]
}>()

const { t } = useI18n()

const muted = ref(false)
const peerMenuActiveInLobby = ref(true)
const requestFullscreenToken = ref<string | null>(null)
const networkInfoActive = ref(false)
const videoEl = ref<HTMLVideoElement>()

function attachStream() {
  if (!videoEl.value) return
  const isMuted = props.peer.isMuted() || props.peer.isLocal() || muted.value
  attachMediaStream(videoEl.value, props.peer.getStream(), isMuted)
}

function detachStream() {
  if (!videoEl.value) return
  attachMediaStream(videoEl.value, null)
}

// Reactive trigger — peer methods like hasVideo() aren't reactive,
// so we bump this on peer events to force recomputation
const peerVersion = ref(0)
function bumpVersion() { peerVersion.value++ }

const peerEvents: (keyof RemotePeerEvents)[] = [
  'stream_ready', 'stream_removed',
  'video_added', 'video_removed',
  'audio_added', 'audio_removed',
  'connection_pending', 'connection_established',
  'connection_closed', 'connection_failed', 'connection_disconnected',
]

onMounted(() => {
  const p = props.peer as RemotePeer
  for (const evt of peerEvents) {
    p.on(evt, bumpVersion)
  }
  props.peer.on('stream_ready', attachStream)
  props.peer.on('video_added', attachStream)
  props.peer.on('stream_removed', detachStream)
  if (props.peer.isReady()) {
    attachStream()
  }
})

onBeforeUnmount(() => {
  const p = props.peer as RemotePeer
  for (const evt of peerEvents) {
    p.off(evt, bumpVersion)
  }
  props.peer.off('stream_ready', attachStream)
  props.peer.off('video_added', attachStream)
  props.peer.off('stream_removed', detachStream)
})

const peerStream = computed(() => { peerVersion.value; return props.peer.getStream() })
const { isSpeaking } = useAudioLevel(peerStream)

const presenceState = computed(() => {
  const presence = props.peer.status?.presence
  if (props.peer.isLocal()) return 'online'
  if (!presence) return 'online'
  return presence as string
})

const presenceTitle = computed(() => {
  switch (presenceState.value) {
    case 'away': return t('peer.presenceAway')
    case 'offline': return t('peer.presenceOffline')
    default: return t('peer.presenceOnline')
  }
})

const peerMenuActive = computed(() => peerMenuActiveInLobby.value)

const status = computed(() => {
  peerVersion.value // reactive dependency on peer state changes
  if (props.peer.error) return 'error'
  if (!props.peer.isReady()) return 'not-ready'
  if (props.peer.hasVideo()) return 'video'
  if (props.peer.hasAudio()) return 'audio'
  if (props.peer.getStream()) return 'camera-off'
  return 'no-media'
})

const menuButtons = computed(() => [
  {
    key: 'toggle-lobby',
    show: peerMenuActive.value && props.type === 'lobby',
    title: t('peer.toggleEnlargeTitle'),
    icon: markRaw(LevelUpIcon),
    action: () => emit('togglePeer'),
  },
  {
    key: 'toggle-stage',
    show: peerMenuActive.value && props.type === 'stage',
    title: t('peer.toggleMinimizeTitle'),
    icon: markRaw(LevelDownIcon),
    action: () => emit('togglePeer'),
  },
  {
    key: 'fullscreen',
    show: peerMenuActive.value && status.value === 'video',
    title: t('peer.fullScreenTitle'),
    icon: markRaw(ResizeIcon),
    action: () => { videoEl.value?.requestFullscreen?.() },
  },
  {
    key: 'network',
    show: peerMenuActive.value && !props.peer.isLocal(),
    title: t('peer.networkInfoTitle'),
    icon: markRaw(NetworkIcon),
    action: () => { networkInfoActive.value = !networkInfoActive.value },
  },
  {
    key: 'mute',
    show: peerMenuActive.value && !props.peer.isLocal() && props.peer.hasAudio() && !props.peer.hasError(),
    title: muted.value ? t('peer.unmuteAudioTitle') : t('peer.muteAudioTitle'),
    icon: markRaw(muted.value ? VolumeOffIcon : VolumeUpIcon),
    action: () => { muted.value = !muted.value; if (videoEl.value) videoEl.value.muted = muted.value },
  },
])

function togglePeerMenu() {
  peerMenuActiveInLobby.value = !peerMenuActiveInLobby.value
}

function hideNetworkInfo() {
  networkInfoActive.value = false
}
</script>

