import { computed } from 'vue'
import { useOnline, useIdle, useDocumentVisibility } from '@vueuse/core'

export type PresenceState = 'online' | 'away' | 'offline'

export function usePresence(idleTimeoutMs = 5 * 60 * 1000) {
  const isOnline = useOnline()
  const { idle: isIdle } = useIdle(idleTimeoutMs)
  const visibility = useDocumentVisibility()

  const isVisible = computed(() => visibility.value === 'visible')

  const presenceState = computed<PresenceState>(() => {
    if (!isOnline.value) return 'offline'
    if (isIdle.value || !isVisible.value) return 'away'
    return 'online'
  })

  return { presenceState, isOnline, isIdle, isVisible }
}
