<template>
  <aside class="absolute z-50 rounded bg-white/80 p-2 text-left text-xs text-primary shadow-md">
    <button
      class="absolute top-1 right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-white text-primary"
      @click="emit('close')"
    >
      <CrossIcon :alt="t('closeAlt')" class="h-3 w-3 fill-current" />
    </button>

    <section class="mb-2">
      <h2 class="mb-1 cursor-default font-bold">
        {{ relayStatusLocalized }}
        <button
          class="ml-1 inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-white"
          @click="emit('open-info-screen', 'network')"
          :title="t('moreInfoTitle')"
        >
          <InfoIcon :alt="t('moreInfoAlt')" class="h-4 w-4 fill-red-500" />
        </button>
      </h2>
    </section>

    <section class="mb-2">
      <h3 class="mb-1 cursor-default font-bold">{{ t('networkInfo.remoteIps') }}</h3>
      <ul>
        <li v-for="ip in allRemoteIps" :key="ip" class="whitespace-nowrap">
          <DotIcon class="mr-0.5 inline h-[1em] w-[1em] fill-current" />
          {{ ip }}
          <span v-if="allRelayIps.includes(ip)"> ({{ t('networkInfo.ipIsRelay') }})</span>
        </li>
      </ul>
    </section>

    <section class="mb-2">
      <h3 class="mb-1 cursor-default font-bold">{{ t('networkInfo.localIps') }}</h3>
      <ul>
        <li v-for="ip in allLocalIps" :key="ip" class="whitespace-nowrap">
          <DotIcon class="mr-0.5 inline h-[1em] w-[1em] fill-current" />
          {{ ip }}
          <span v-if="allRelayIps.includes(ip)"> ({{ t('networkInfo.ipIsRelay') }})</span>
        </li>
      </ul>
    </section>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { type RemotePeer, getRemoteIps, getLocalIps, getRelayIps, getMyRelayStatus } from '@palava/client'
import config from '@/config'
import CrossIcon from '@/assets/icons/cross.svg?component'
import InfoIcon from '@/assets/icons/info-with-circle.svg?component'
import DotIcon from '@/assets/icons/dot-single.svg?component'

const props = defineProps<{ peer: RemotePeer }>()
const emit = defineEmits<{
  close: []
  'open-info-screen': [page: string]
}>()

const { t } = useI18n()
const relayStatus = ref<string | null>(null)

onMounted(() => {
  if (!props.peer.peerConnection) return

  getMyRelayStatus(props.peer.peerConnection).then((iAmRelayed) => {
    if (iAmRelayed) {
      relayStatus.value = 'relayed'
    } else if (allRemoteIps.value?.some((ip) => allRelayIps.value.includes(ip))) {
      relayStatus.value = 'relayed'
    } else {
      relayStatus.value = 'direct'
    }
  }).catch(() => {
    relayStatus.value = null
  })
})

const allLocalIps = computed(() => getLocalIps(props.peer.peerConnection))
const allRemoteIps = computed(() => getRemoteIps(props.peer.peerConnection))
const allRelayIps = computed(() => getRelayIps(config.env.turnUrls))

const relayStatusLocalized = computed(() => {
  if (relayStatus.value === 'relayed') return t('networkInfo.relayedConnection')
  if (relayStatus.value === 'direct') return t('networkInfo.directConnection')
  return t('networkInfo.unknownConnection')
})
</script>
