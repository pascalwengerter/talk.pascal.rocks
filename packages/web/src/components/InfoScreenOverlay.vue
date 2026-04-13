<template>
  <aside
    ref="el"
    class="fixed inset-0 z-50 flex flex-col overflow-auto bg-surface p-6 text-sm text-text-secondary outline-none md:inset-4 md:top-16 md:rounded-2xl md:bg-surface-light md:shadow-2xl"
    tabindex="0"
    @keydown.esc="emit('close')"
  >
    <button
      class="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-text transition hover:bg-white/20 focus:outline-none"
      @click="emit('close')"
    >
      <CrossIcon class="h-4 w-4 fill-current" />
    </button>

    <NavigationBar
      type="screen"
      class="pr-10"
      @open-info-screen="(page) => emit('open-info-screen', page)"
    />

    <h1 class="my-4 text-2xl font-bold text-text">{{ infoPage.title }}</h1>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="prose prose-invert max-w-none [&_a]:text-primary [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-text [&_li]:ml-4 [&_li]:list-disc [&_ul]:mt-2" v-html="infoPage.content" />
  </aside>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import NavigationBar from '@/components/NavigationBar.vue'
import CrossIcon from '@/assets/icons/cross.svg?component'
import en from '@/i18n/en'
import de from '@/i18n/de'

const props = defineProps<{ page: string }>()
const emit = defineEmits<{
  close: []
  'open-info-screen': [page: string]
}>()

const { locale } = useI18n()
const messages: Record<string, typeof en> = { en, de }

const el = ref<HTMLElement>()

const infoPage = computed(() => {
  const msgs = messages[locale.value] ?? en
  return msgs.infoPages.find((ip) => ip.id === props.page) ?? { id: '', title: '', content: '' }
})

onMounted(() => {
  if (props.page) el.value?.focus()
})

watch(() => props.page, (newPage) => {
  if (newPage) el.value?.focus()
})
</script>
