<template>
  <button
    :title="t('switchTheme')"
    class="cursor-pointer rounded-md bg-text/5 px-2.5 py-1 text-xs font-medium text-text-secondary transition hover:bg-text/10 hover:text-text focus:outline-none"
    @click="toggle"
  >
    {{ theme === 'dark' ? '☀️' : '🌙' }}
  </button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/composables/useTheme'

const { t } = useI18n()
const { theme, toggle } = useTheme()
</script>
