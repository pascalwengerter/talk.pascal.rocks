<template>
  <button
    :title="t('switchLanguageTitle')"
    class="cursor-pointer rounded-md bg-text/5 px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-text-secondary transition hover:bg-text/10 hover:text-text focus:outline-none"
    @click="switchLanguage"
  >
    {{ locale }}
  </button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

function switchLanguage() {
  locale.value = locale.value === 'de' ? 'en' : 'de'
}
</script>
