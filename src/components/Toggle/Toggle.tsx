import styles from './Toggle.module.css'

interface ToggleProps {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  /** id of an element with explanatory text, announced after the label. */
  describedBy?: string
}

export function Toggle({
  id,
  label,
  checked,
  onChange,
  describedBy,
}: ToggleProps) {
  return (
    <div className={styles.wrapper}>
      <input
        id={id}
        type="checkbox"
        role="switch"
        className={styles.input}
        checked={checked}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.checked)}
      />

      <label htmlFor={id} className={styles.label}>
        {/* Dekorative Elemente sind sauber vom Text getrennt */}
        <span className={styles.track} aria-hidden="true">
          <span className={styles.knob} />
        </span>
        <span className={styles.labelText}>{label}</span>
      </label>
    </div>
  )
}
