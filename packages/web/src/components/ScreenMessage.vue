<template>
  <aside class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface">
    <div class="mb-6 flex gap-2">
      <div class="pulse-dot h-3 w-3 rounded-full bg-primary" />
      <div class="pulse-dot h-3 w-3 rounded-full bg-primary" />
      <div class="pulse-dot h-3 w-3 rounded-full bg-primary" />
    </div>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <p class="text-lg text-muted" v-html="message" />
  </aside>
</template>

<script setup lang="ts">
defineProps<{ message: string }>()
</script>
