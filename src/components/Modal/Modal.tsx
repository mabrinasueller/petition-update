import { useId, type ReactNode } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  title: string;
  children: ReactNode;
}

/**
 * Deliberately has no `onClose`for now. Must be implemented if embedded into real page
 */
export function Modal({ title, children }: ModalProps) {
  const headingId = useId();

  return (
    <div className={styles.backdrop}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
      >
        <div className={styles.header}>
          <h1 id={headingId} className={styles.title}>
            {title}
          </h1>
          <button type="button" className={styles.close} aria-label="Schließen" disabled>
            <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              <path
                d="M4 4 L16 16 M16 4 L4 16"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
