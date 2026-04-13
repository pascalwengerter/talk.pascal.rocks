<template>
  <aside :class="['fixed inset-y-0 right-0 z-50 flex w-80 max-w-full flex-col bg-surface-light text-text transition-transform duration-300', open ? 'translate-x-0' : 'translate-x-full']">
    <div class="flex items-center justify-between border-b border-text/10 px-4 py-3">
      <span class="text-base font-semibold">{{ t('chat.title') }}</span>
      <button class="flex cursor-pointer border-none bg-transparent p-1 text-text" @click="emit('close')" :title="t('closeAlt')">
        <CrossIcon class="h-4 w-4 fill-current" />
      </button>
    </div>

    <div class="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-3" ref="messagesEl">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        :class="['flex max-w-[85%] flex-col', msg.senderId === localPeerId ? 'items-end self-end' : 'items-start']"
      >
        <span :class="['rounded-xl px-3 py-2 text-sm leading-snug break-words', msg.senderId === localPeerId ? 'bg-primary text-white' : 'bg-text/10']">{{ msg.text }}</span>
        <span class="mt-0.5 px-1 text-[11px] text-text-secondary">{{ formatTime(msg.timestamp) }}</span>
      </div>
      <div v-if="messages.length === 0" class="mt-6 text-center text-sm text-text-secondary">
        {{ t('chat.empty') }}
      </div>
    </div>

    <form class="flex gap-2 border-t border-text/10 p-3" @submit.prevent="sendMessage">
      <input
        v-model="inputText"
        :placeholder="t('chat.placeholder')"
        class="flex-1 rounded-md border border-text/20 bg-text/5 px-3 py-2 text-sm text-text outline-none placeholder:text-text-secondary focus:border-primary"
        ref="inputEl"
        autocomplete="off"
        maxlength="500"
      />
      <button
        type="submit"
        class="cursor-pointer rounded-md border-none bg-primary px-4 py-2 text-sm text-white hover:bg-primary-hover disabled:cursor-default disabled:opacity-40"
        :disabled="!inputText.trim()"
      >
        {{ t('chat.send') }}
      </button>
    </form>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import CrossIcon from '@/assets/icons/cross.svg?component'

const props = defineProps<{
  messages: Array<{ senderId: string, text: string, timestamp: number }>
  localPeerId: string
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  send: [text: string]
}>()

const { t } = useI18n()
const inputText = ref('')
const messagesEl = ref<HTMLDivElement>()
const inputEl = ref<HTMLInputElement>()

function sendMessage() {
  const text = inputText.value.trim()
  if (!text) return
  emit('send', text)
  inputText.value = ''
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

watch(() => props.messages.length, () => {
  nextTick(() => {
    if (messagesEl.value) {
      messagesEl.value.scrollTop = messagesEl.value.scrollHeight
    }
  })
})

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    nextTick(() => inputEl.value?.focus())
  }
})
</script>
