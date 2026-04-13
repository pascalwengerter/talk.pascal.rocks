<template>
  <button type="button" class="absolute inset-0 z-40 flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden border-none bg-transparent text-center" @click="emit('click')">
    <div class="-translate-y-[15%]">
      <div v-if="status === 'audio'">
        <PhoneIcon class="h-10 w-10 fill-white/50 drop-shadow" />
      </div>
      <div v-else-if="status === 'not-ready'" class="flex flex-col items-center gap-3">
        <div class="flex gap-2">
          <div class="pulse-dot h-3 w-3 rounded-full bg-white/60" />
          <div class="pulse-dot h-3 w-3 rounded-full bg-white/60" />
          <div class="pulse-dot h-3 w-3 rounded-full bg-white/60" />
        </div>
        <span class="text-xs text-white/50">{{ t('peer.waiting') }}</span>
      </div>
      <div v-else-if="status === 'camera-off'" class="flex flex-col items-center gap-2">
        <BlockIcon class="h-10 w-10 fill-white/50 drop-shadow" />
        <span class="text-xs text-white/50">{{ t('peer.cameraOff') }}</span>
      </div>
      <div v-else-if="status === 'no-media'" class="flex flex-col items-center gap-2">
        <BlockIcon class="h-10 w-10 fill-white/50 drop-shadow" />
        <span class="text-xs text-white/50">{{ t('peer.noMedia') }}</span>
      </div>
      <div v-else-if="status === 'error'" class="flex flex-col items-center gap-2">
        <CircleCrossIcon class="h-10 w-10 fill-white/50 drop-shadow" />
        <span v-if="error === 'connection_closed'" class="text-xs text-white/50">{{ t('peer.errorConnectionClosed') }}</span>
        <span v-else-if="error === 'connection_failed'" class="text-xs text-white/50">{{ t('peer.errorConnectionFailed') }}</span>
        <span v-else-if="error === 'connection_disconnected'" class="text-xs text-white/50">{{ t('peer.errorConnectionDisconnected') }}</span>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PhoneIcon from '@/assets/icons/phone.svg?component'
import BlockIcon from '@/assets/icons/block.svg?component'
import CircleCrossIcon from '@/assets/icons/circle-with-cross.svg?component'

defineProps<{
  status: string
  error?: string | null
}>()

const emit = defineEmits<{ click: [] }>()
const { t } = useI18n()
</script>
