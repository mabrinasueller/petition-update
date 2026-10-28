import { formatNumber } from '../../lib/format'
import styles from './CharacterCounter.module.css'

interface CharacterCounterProps {
  id: string
  current: number
  max: number
}

export function CharacterCounter({ id, current, max }: CharacterCounterProps) {
  // `maxLength` on the inputs makes this unreachable by typing; it guards
  // against programmatically set values. The red styling is the only signal —
  // `aria-invalid` belongs on the input itself, not on a paragraph.
  const isExceeded = current > max

  return (
    <p
      id={id}
      className={styles.counter}
      data-exceeded={isExceeded || undefined}
    >
      {`${formatNumber(current)} / ${formatNumber(max)} Zeichen`}
    </p>
  )
}
