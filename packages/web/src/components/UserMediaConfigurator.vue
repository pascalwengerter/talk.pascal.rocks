<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-surface px-4">
    <div class="absolute top-4 right-4 flex items-center gap-2">
      <ThemeSwitcher />
      <LanguageSwitcher />
    </div>

    <div class="w-full max-w-lg rounded-2xl bg-surface-light p-8 shadow-2xl">
      <h1 class="mb-2 text-2xl font-bold text-text">{{ t('room.gumHeading') }}</h1>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <p class="mb-6 text-sm leading-relaxed text-muted" v-html="t('room.gumIntro')" />

      <p class="mb-4 text-sm text-text-secondary">{{ t('room.gumChooseMedia') }}</p>

      <div class="flex justify-center gap-4">
        <button
          autofocus
          :title="t('room.gumChoiceVideoAndAudio')"
          class="flex flex-col items-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-medium text-text shadow transition hover:bg-primary-hover active:scale-95"
          @click="emit('join-room', { video: videoConstraints, audio: true })"
        >
          <div class="flex gap-1">
            <VideoCameraIcon class="h-6 w-6 fill-white" />
            <MicIcon class="h-6 w-6 fill-white" />
          </div>
          {{ t('room.gumChoiceVideoAndAudio') }}
        </button>
        <button
          :title="t('room.gumChoiceVideo')"
          class="flex flex-col items-center gap-2 rounded-xl bg-white/5 px-5 py-4 text-sm text-text-secondary transition hover:bg-white/10 active:scale-95"
          @click="emit('join-room', { video: videoConstraints, audio: false })"
        >
          <VideoCameraIcon class="h-6 w-6 fill-current" />
          {{ t('room.gumChoiceVideo') }}
        </button>
        <button
          :title="t('room.gumChoiceAudio')"
          class="flex flex-col items-center gap-2 rounded-xl bg-white/5 px-5 py-4 text-sm text-text-secondary transition hover:bg-white/10 active:scale-95"
          @click="emit('join-room', { video: false, audio: true })"
        >
          <MicIcon class="h-6 w-6 fill-current" />
          {{ t('room.gumChoiceAudio') }}
        </button>
      </div>

      <div v-if="error" class="mt-6 rounded-lg bg-danger/10 p-4">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <h2 class="mb-2 text-sm font-semibold text-danger"><div v-html="t('room.gumErrorHeading')" /></h2>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="text-xs text-text-secondary [&_li]:ml-4 [&_li]:list-disc [&_ul]:mt-1" v-html="t('room.gumErrorReasons')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import VideoCameraIcon from '@/assets/icons/video-camera.svg?component'
import MicIcon from '@/assets/icons/mic.svg?component'
import config from '@/config'

withDefaults(defineProps<{ error?: string | null }>(), { error: null })
const emit = defineEmits<{
  'join-room': [config: MediaStreamConstraints]
}>()

const { t } = useI18n()
const videoConstraints = config.gumVideoConstraints
</script>
