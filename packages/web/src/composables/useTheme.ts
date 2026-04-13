import { ref, watchEffect } from 'vue'

export const themes = [
  { id: 'dark', label: 'Dark' },
  { id: 'light', label: 'Light' },
] as const

export type ThemeId = (typeof themes)[number]['id']

const stored = localStorage.getItem('theme') as ThemeId | null
const theme = ref<ThemeId>(stored === 'light' ? 'light' : 'dark')

document.documentElement.setAttribute('data-theme', theme.value)

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.setItem('theme', theme.value)
})

export function useTheme() {
  return { theme, themes, toggle }
}

function toggle() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}
