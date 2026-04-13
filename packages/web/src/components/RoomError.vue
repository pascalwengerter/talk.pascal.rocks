<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-surface px-4">
    <div class="w-full max-w-md rounded-2xl bg-surface-light p-8 text-center shadow-2xl">
      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger/10 text-3xl">
        <span v-if="error === 'room_full'">&#128101;</span>
        <span v-else-if="error === 'maintenance'">&#128295;</span>
        <span v-else>&#9888;&#65039;</span>
      </div>

      <div v-if="error === 'room_full'">
        <h1 class="mb-2 text-xl font-bold text-text">{{ t('room.errorFullHeading') }}</h1>
        <p class="mb-6 text-sm text-muted">{{ t('room.errorFullDescription') }}</p>
      </div>
      <div v-else-if="error === 'maintenance'">
        <h1 class="mb-2 text-xl font-bold text-text">{{ t('room.errorMaintenanceHeading') }}</h1>
        <p class="mb-6 text-sm text-muted">{{ t('room.errorMaintenanceDescription') }}</p>
      </div>
      <div v-else>
        <h1 class="mb-2 text-xl font-bold text-text">{{ t('room.errorConnectionHeading') }}</h1>
        <p class="mb-6 text-sm text-muted">{{ t('room.errorConnectionDescription') }}</p>
      </div>

      <div class="flex justify-center gap-3">
        <button
          type="button"
          @click="reload()"
          class="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-text transition hover:bg-primary-hover"
        >
          {{ t('room.tryAgain') }}
        </button>
        <router-link
          to="/"
          class="rounded-lg bg-white/5 px-6 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-white/10"
        >
          {{ t('room.goHome') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

withDefaults(defineProps<{ error?: string | null }>(), { error: null })
const { t } = useI18n()
function reload() { window.location.reload() }
</script>
