<template>
  <main :class="['fixed inset-0 flex overflow-auto bg-black', partyMode === 'landscape' ? 'flex-row' : 'flex-col']">
    <nav class="absolute top-3 left-3 z-50 flex items-center gap-2">
      <button
        :title="t('party.toggleControls')"
        class="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white shadow-lg backdrop-blur-sm transition hover:bg-white/30 focus:outline-none sm:h-10 sm:w-10"
        ref="logoBtn"
        @click="controlsActive = !controlsActive"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      <template v-for="btn in controlButtons" :key="btn.key">
        <transition name="fade-control">
          <button
            v-if="btn.show"
            :title="btn.title"
            :class="['relative flex h-9 w-9 items-center justify-center rounded-full border-none shadow-lg backdrop-blur-sm transition focus:outline-none sm:h-10 sm:w-10', 'active' in btn && btn.active ? 'bg-primary text-white' : 'bg-white/20 text-white hover:bg-white/30']"
            @click="btn.action"
          >
            <component :is="btn.icon" v-if="btn.icon" class="h-4 w-4 fill-current sm:h-5 sm:w-5" />
            <span v-if="btn.text" class="text-xs font-medium uppercase sm:text-sm">{{ btn.text }}</span>
            <span v-if="btn.badge && btn.badge > 0" class="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">{{ btn.badge }}</span>
          </button>
        </transition>
      </template>

      <transition name="fade-control">
        <router-link
          v-if="controlsActive"
          to="/"
          :title="t('party.hangUpTitle')"
          class="flex h-9 w-9 items-center justify-center rounded-full bg-danger text-white shadow-lg transition hover:bg-red-600 focus:outline-none sm:h-10 sm:w-10"
        >
          <PhoneIcon class="h-4 w-4 rotate-[225deg] fill-current sm:h-5 sm:w-5" />
        </router-link>
      </transition>
    </nav>

    <div
      :class="'flex flex-1 items-center justify-center overflow-hidden bg-black'"
      ref="stageEl"
    >
      <transition-group name="fade-control" tag="ul"
        :class="spotlightClasses"
      >
        <PeerTile v-for="peer in stagePeers"
          :key="peer.id"
          type="stage"
          :class="stageTileClasses"
          :partyMode="partyMode"
          :stageMode="stageMode"
          :peer="peer"
          :colorIndex="getColorIndex(peer)"
          @togglePeer="togglePeer(peer)"
          @open-info-screen="(page) => emit('open-info-screen', page)"
        />
      </transition-group>
    </div>

    <transition name="fade-control" @after-leave="onResize">
      <div v-if="lobbyPeers.length > 0" :class="['shrink-0 overflow-hidden bg-neutral-900', partyMode === 'landscape' ? 'h-full' : 'h-24 w-full md:h-28 lg:h-32']">
        <transition-group name="fade-control" tag="ul"
          :class="['flex h-full w-full', partyMode === 'portrait' ? 'flex-row overflow-x-auto' : 'flex-col overflow-y-auto']"
        >
          <PeerTile v-for="peer in lobbyPeers"
            :key="peer.id"
            type="lobby"
            :partyMode="partyMode"
            :stageMode="stageMode"
            :peer="peer"
            :colorIndex="getColorIndex(peer)"
            @togglePeer="togglePeer(peer)"
            @open-info-screen="(page) => emit('open-info-screen', page)"
            :class="partyMode === 'landscape' ? 'h-full w-40 md:w-52 lg:w-60 xl:w-72' : 'h-full w-48 shrink-0'"
          />
        </transition-group>
      </div>
    </transition>
  </main>

  <ChatPanel
    :messages="chatMessages ?? []"
    :localPeerId="localPeer.id"
    :open="chatOpen"
    @close="chatOpen = false"
    @send="(text) => emit('send-chat', text)"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, markRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import { useShare, useClipboard } from '@vueuse/core'
import type { Peer, LocalPeer } from '@palava/client'
import PeerTile from '@/components/PeerTile.vue'
import ChatPanel from '@/components/ChatPanel.vue'
import config from '@/config'
import InfoIcon from '@/assets/icons/info-with-circle.svg?component'
import LinkIcon from '@/assets/icons/link.svg?component'
import VideoCameraIcon from '@/assets/icons/video-camera.svg?component'
import VideoCameraOffIcon from '@/assets/icons/video-camera-off.svg?component'
import MicIcon from '@/assets/icons/mic.svg?component'
import MicOffIcon from '@/assets/icons/mic-off.svg?component'
import TvIcon from '@/assets/icons/tv.svg?component'
import ChatIcon from '@/assets/icons/chat.svg?component'
import PhoneIcon from '@/assets/icons/phone.svg?component'

const props = defineProps<{
  peers: Peer[]
  localPeer: LocalPeer
  chatMessages?: Array<{ senderId: string, text: string, timestamp: number }>
}>()

const emit = defineEmits<{
  'open-info-screen': [page: string]
  'send-chat': [text: string]
}>()

const { t, locale } = useI18n()
const { share, isSupported: shareSupported } = useShare()
const { copy, isSupported: clipboardSupported } = useClipboard()

const partyMode = ref<'landscape' | 'portrait'>('landscape')
const stageMode = ref<'landscape' | 'portrait'>('landscape')
const peersInLobby = ref<string[]>([])
const peerColors = ref<(string | null)[]>(Array(config.peerColors.length - 1).fill(null))
const controlsActive = ref(true)
const cameraOff = ref(false)
const microphoneMuted = ref(false)
const joinedWithVideo = ref(props.localPeer.hasVideo())
const joinedWithAudio = ref(props.localPeer.hasAudio())
const screenSharing = ref(false)
const canScreenShare = ref(!!navigator.mediaDevices?.getDisplayMedia)
const chatOpen = ref(false)
const unreadCount = ref(0)

const logoBtn = ref<HTMLButtonElement>()
const stageEl = ref<HTMLDivElement>()

const canShare = computed(() => shareSupported.value || clipboardSupported.value)

const peerCount = computed(() => Math.min(stagePeers.value.length, 6))

const spotlightClasses = computed(() => {
  const n = peerCount.value
  const landscape = stageMode.value === 'landscape'

  // Base: always full size, hidden overflow
  const base = 'h-full w-full overflow-hidden'

  if (n <= 1) {
    // empty or one: center the single tile
    return landscape
      ? `${base} text-center`
      : `${base} flex flex-col justify-center`
  }
  if (n === 2) {
    return landscape
      ? `${base} flex items-center`
      : `${base} text-center`
  }
  if (n <= 4) {
    return `${base} grid grid-cols-2 grid-rows-2`
  }
  // 5-6
  return landscape
    ? `${base} grid grid-cols-3 grid-rows-2`
    : `${base} grid grid-cols-2 grid-rows-3`
})

const stageTileClasses = computed(() => {
  const n = peerCount.value
  const landscape = stageMode.value === 'landscape'

  if (n <= 1) {
    return landscape
      ? 'h-full max-w-full'
      : 'w-full max-h-full'
  }
  if (n === 2) {
    return landscape
      ? 'w-1/2'
      : 'h-1/2'
  }
  // 3-6: grid cells, fill completely
  return 'h-full w-full'
})

const controlButtons = computed(() => [
  {
    key: 'info', show: controlsActive.value,
    title: t('party.infoTitle'),
    icon: markRaw(InfoIcon), action: () => emit('open-info-screen', 'about'),
  },
  {
    key: 'copy', show: controlsActive.value && canShare.value,
    title: t('party.copyLinkTitle'),
    icon: markRaw(LinkIcon), action: copyShareLink,
  },
  {
    key: 'camera', show: controlsActive.value && joinedWithVideo.value,
    title: cameraOff.value ? t('party.turnOnCameraTitle') : t('party.turnOffCameraTitle'),
    icon: markRaw(cameraOff.value ? VideoCameraOffIcon : VideoCameraIcon),
    action: toggleCamera, active: !cameraOff.value,
  },
  {
    key: 'mic', show: controlsActive.value && joinedWithAudio.value,
    title: microphoneMuted.value ? t('party.unmuteMicrophoneTitle') : t('party.muteMicrophoneTitle'),
    icon: markRaw(microphoneMuted.value ? MicOffIcon : MicIcon),
    action: toggleMicrophone, active: !microphoneMuted.value,
  },
  {
    key: 'screen', show: controlsActive.value && canScreenShare.value,
    title: t('party.screenShareTitle'),
    icon: markRaw(TvIcon), action: toggleScreenShare,
    active: screenSharing.value,
  },
  {
    key: 'chat', show: controlsActive.value,
    title: t('party.chatTitle'),
    icon: markRaw(ChatIcon), action: toggleChat,
    badge: unreadCount.value,
  },
  {
    key: 'lang', show: controlsActive.value,
    title: t('switchLanguageTitle'),
    text: locale.value, action: switchLanguage,
  },
])

const stagePeers = computed(() =>
  props.peers.filter((peer) => !peersInLobby.value.includes(peer.id)),
)
const lobbyPeers = computed(() =>
  props.peers.filter((peer) => peersInLobby.value.includes(peer.id)),
)

function togglePeer(peer: Peer) {
  if (peersInLobby.value.includes(peer.id)) {
    peersInLobby.value = peersInLobby.value.filter((id) => id !== peer.id)
  } else {
    peersInLobby.value = [...peersInLobby.value, peer.id]
  }
}

function sendPeerToLobby(peer: Peer) {
  if (!peersInLobby.value.includes(peer.id)) {
    peersInLobby.value = [...peersInLobby.value, peer.id]
  }
}

function sendPeerToStage(peer: Peer) {
  if (peersInLobby.value.includes(peer.id)) {
    peersInLobby.value = peersInLobby.value.filter((id) => id !== peer.id)
  }
}

function cleanLobby(removedPeers: Peer[]) {
  const removedIds = removedPeers.map((p) => p.id)
  peersInLobby.value = peersInLobby.value.filter((id) => !removedIds.includes(id))
}

function getColorIndex(peer: Peer): number {
  return peerColors.value.indexOf(peer.id) + 1
}

function assignColorIndexes(introducedPeers: Peer[], removedPeers: Peer[] = []) {
  const removedIds = removedPeers.map((rp) => rp.id)
  peerColors.value = peerColors.value.map((idOrNull) =>
    removedIds.includes(idOrNull as string) ? null : idOrNull,
  )

  introducedPeers.forEach((peer) => {
    if (!peerColors.value.includes(null)) return
    let newIndex: number
    do {
      newIndex = Math.floor(Math.random() * (config.peerColors.length - 1))
    } while (peerColors.value[newIndex] !== null)
    peerColors.value = peerColors.value.map((idOrNull, index) =>
      index === newIndex ? peer.id : idOrNull,
    )
  })
}

function autoAdjustPeers(_peers: Peer[]) {
  // Keep all peers on stage — lobby is opt-in via toggle
}

function copyShareLink() {
  const url = window.location.href
  if (shareSupported.value) {
    share({ url })
  } else {
    copy(url).catch((e) => console.warn('clipboard copy failed:', e))
  }
}

function switchLanguage() {
  locale.value = locale.value === 'de' ? 'en' : 'de'
}

function toggleMicrophone() {
  microphoneMuted.value = !microphoneMuted.value
  if (microphoneMuted.value) {
    props.localPeer.disableAudio()
  } else {
    props.localPeer.requestAudio()
  }
}

function toggleCamera() {
  cameraOff.value = !cameraOff.value
  if (cameraOff.value) {
    props.localPeer.disableVideo()
  } else {
    props.localPeer.requestVideo()
  }
}

async function toggleScreenShare() {
  if (screenSharing.value) {
    stopScreenShare()
    return
  }

  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { cursor: 'always' } as MediaTrackConstraints,
      audio: false,
    })

    const screenTrack = stream.getVideoTracks()[0]
    if (!screenTrack) return

    const localStream = props.localPeer.getStream()
    if (localStream) {
      for (const track of localStream.getVideoTracks()) {
        track.stop()
        localStream.removeTrack(track)
        props.localPeer.emit('video_removed', track, localStream)
      }
      localStream.addTrack(screenTrack)
      props.localPeer.emit('video_added', screenTrack, localStream)
    }

    screenSharing.value = true
    cameraOff.value = false

    screenTrack.onended = () => {
      stopScreenShare()
    }
  } catch (e) {
    if ((e as DOMException).name !== 'NotAllowedError') {
      console.error('screen share failed:', e)
    }
  }
}

function stopScreenShare() {
  if (!screenSharing.value) return
  screenSharing.value = false

  const localStream = props.localPeer.getStream()
  if (localStream) {
    for (const track of localStream.getVideoTracks()) {
      track.stop()
      localStream.removeTrack(track)
      props.localPeer.emit('video_removed', track, localStream)
    }
  }

  props.localPeer.requestVideo(config.gumVideoConstraints).catch(() => {
    cameraOff.value = true
  })
}

function toggleChat() {
  chatOpen.value = !chatOpen.value
  if (chatOpen.value) {
    unreadCount.value = 0
  }
}

function onResize() {
  const pw = window.innerWidth
  const ph = window.innerHeight
  const sw = stageEl.value?.clientWidth ?? 0
  const sh = stageEl.value?.clientHeight ?? 0

  partyMode.value = pw < ph ? 'portrait' : 'landscape'
  stageMode.value = sw < sh ? 'portrait' : 'landscape'
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  onResize()
  assignColorIndexes(props.peers)
  autoAdjustPeers(props.peers)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})

watch(() => props.chatMessages?.length, (newLen, oldLen) => {
  if (!chatOpen.value && newLen && oldLen && newLen > oldLen) {
    unreadCount.value += newLen - oldLen
  }
})

watch(() => props.peers, (newPeers, oldPeers) => {
  const introduced = newPeers.filter((np) => !oldPeers.includes(np))
  const removed = oldPeers.filter((op) => !newPeers.includes(op))
  cleanLobby(removed)
  assignColorIndexes(introduced, removed)
  autoAdjustPeers(newPeers)
})
</script>
