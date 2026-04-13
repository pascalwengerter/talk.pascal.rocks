<template>
  <nav class="flex gap-4 border-b border-text/10 pb-4">
    <template v-for="infoPage in infoPages" :key="infoPage.id">
      <router-link
        :to="`/info/${infoPage.id}`"
        class="text-sm text-text-secondary transition hover:text-text"
        active-class="text-primary!"
        @click="(e) => checkScreen(infoPage.id, e)"
      >
        {{ infoPage.title }}
      </router-link>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import en from '@/i18n/en'
import de from '@/i18n/de'

const props = withDefaults(defineProps<{
  type?: string
}>(), { type: 'page' })

const emit = defineEmits<{
  'open-info-screen': [page: string]
}>()

const { locale } = useI18n()

const messages: Record<string, typeof en> = { en, de }

const infoPages = computed(() => {
  const msgs = messages[locale.value] ?? en
  return msgs.infoPages.filter((ip) => !('linked' in ip && ip.linked === false))
})

function checkScreen(infoPage: string, event: Event) {
  if (props.type === 'screen') {
    event.preventDefault()
    emit('open-info-screen', infoPage)
  }
}
</script>
