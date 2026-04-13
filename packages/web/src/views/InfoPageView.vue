<template>
  <div class="flex min-h-screen flex-col bg-surface">
    <header class="flex items-center justify-between p-4">
      <router-link to="/" class="text-sm font-medium text-text-secondary transition hover:text-text">&larr; {{ t('home.back') }}</router-link>
      <LanguageSwitcher />
    </header>

    <main class="mx-auto w-full max-w-3xl flex-1 px-4 pb-12">
      <NavigationBar />

      <h1 class="my-6 text-3xl font-bold text-text">{{ infoPage.title }}</h1>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="prose prose-invert max-w-none text-text-secondary [&_a]:text-primary [&_a:hover]:text-primary-hover [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-text [&_li]:ml-4 [&_li]:list-disc [&_strong]:text-text [&_ul]:mt-2" v-html="infoPage.content" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import NavigationBar from '@/components/NavigationBar.vue'
import en from '@/i18n/en'
import de from '@/i18n/de'

const props = defineProps<{ page: string }>()
const { t, locale } = useI18n()

const messages: Record<string, typeof en> = { en, de }

const infoPage = computed(() => {
  const msgs = messages[locale.value] ?? en
  return msgs.infoPages.find((ip) => ip.id === props.page) ?? { id: '', title: '', content: '' }
})

watchEffect(() => {
  document.title = `${infoPage.value.title} | Burktef`
})
</script>
