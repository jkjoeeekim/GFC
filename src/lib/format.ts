export function titleCase(text: string) {
  return text.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()).replace(/, Ca$/, ', CA')
}
