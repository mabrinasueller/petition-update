/**
 * Formats a raw number into a German-localized string with thousands separators.
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('de-DE').format(value);
}
