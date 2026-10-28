const numberFormat = new Intl.NumberFormat('de-DE')

export function formatNumber(value: number): string {
  return numberFormat.format(value)
}

const timeFormat = new Intl.DateTimeFormat('de-DE', {
  hour: '2-digit',
  minute: '2-digit',
})

export function formatTime(isoDate: string): string {
  return timeFormat.format(new Date(isoDate))
}
