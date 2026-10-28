import styles from './Toggle.module.css';

interface ToggleProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Toggle({ id, label, checked, onChange }: ToggleProps) {
  return (
    <div className={styles.wrapper}>
      <input
        id={id}
        type="checkbox"
        role="switch"
        className={styles.input}
        checked={checked}
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
  );
}
