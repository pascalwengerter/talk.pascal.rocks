<template>
  <main class="flex min-h-screen flex-col bg-surface text-text">
    <header class="flex items-center justify-end gap-2 p-4">
      <ThemeSwitcher />
      <LanguageSwitcher />
    </header>

    <div v-if="canUseWebrtc" class="mx-auto flex flex-1 flex-col items-center justify-center px-4 pb-24">
      <div class="mb-2 text-5xl">🥫</div>
      <h1 class="mb-2 text-4xl font-bold tracking-tight sm:text-5xl">Burktef</h1>
      <p class="mb-10 max-w-md text-center text-lg text-muted">
        {{ t('home.subtitle') }}
      </p>

      <button
        @click="createRoom"
        class="mb-6 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-text shadow-lg transition hover:bg-primary-hover hover:shadow-xl focus:ring-2 focus:ring-primary/50 focus:outline-none active:scale-95"
      >
        {{ t('home.createRoom') }}
      </button>

      <div class="flex w-full max-w-sm items-center gap-2">
        <div class="h-px flex-1 bg-text/10" />
        <span class="text-xs uppercase tracking-wide text-muted">{{ t('home.or') }}</span>
        <div class="h-px flex-1 bg-text/10" />
      </div>

      <form @submit.prevent="goIntoRoom" class="mt-6 flex w-full max-w-sm gap-2">
        <input
          v-model="roomId"
          :placeholder="t('home.roomIdPlaceholder')"
          ref="roomInput"
          maxlength="50"
          class="flex-1 rounded-lg border border-white/10 bg-surface-light px-4 py-3 text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary/50"
        />
        <button
          type="submit"
          class="rounded-lg bg-surface-light px-5 py-3 font-medium text-text transition hover:bg-text/10 focus:ring-2 focus:ring-primary/50 focus:outline-none"
        >
          {{ t('home.join') }}
        </button>
      </form>
    </div>

    <div v-else class="mx-auto flex flex-1 flex-col items-center justify-center px-4">
      <div class="max-w-md rounded-xl bg-surface-light p-8 text-center">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="text-muted" v-html="t('home.noSupportMessage')" />
      </div>
    </div>

    <footer class="flex items-center justify-center gap-6 p-4 text-sm text-muted">
      <router-link to="/info/about" class="transition hover:text-text">{{ t('home.about') }}</router-link>
      <a href="https://github.com/palavatv/palava" class="transition hover:text-text">GitHub</a>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useFocus } from '@vueuse/core'
import { browserCanUseWebrtc } from '@palava/client'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const roomId = ref('')
const roomInput = ref<HTMLInputElement>()
useFocus(roomInput, { initialValue: false })

const canUseWebrtc = computed(() =>
  browserCanUseWebrtc() && route.query.supported !== '0',
)

function createRoom() {
  router.push({ path: crypto.randomUUID() })
}

function goIntoRoom() {
  if (roomId.value) {
    router.push({ path: encodeURIComponent(roomId.value) })
  } else {
    createRoom()
  }
}
</script>
