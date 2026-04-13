/** Returns a repeated can emoji for a given count */
export function fancyNumber(n: number): string {
  return '\u{1F96B}'.repeat(n)
}

/** Detect user's browser language */
export function detectLanguage(): string | undefined {
  return navigator.languages?.[0] ?? navigator.language
}

/** Escapes a regex */
export function escapeRegex(string: string): string {
  return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}
