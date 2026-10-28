import { formatNumber } from '../../lib/format';
import styles from './CharacterCounter.module.css';

interface CharacterCounterProps {
  id: string;
  current: number;
  max: number;
}

export function CharacterCounter({ id, current, max }: CharacterCounterProps) {
  const isExceeded = current > max;

  return (
    <p
      id={id}
      className={styles.counter}
      data-exceeded={isExceeded || undefined}
      aria-invalid={isExceeded ? 'true' : undefined}
    >
      {`${formatNumber(current)} / ${formatNumber(max)} Zeichen`}
    </p>
  );
}
