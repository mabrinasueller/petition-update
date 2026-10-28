import { useEffect, useId, useRef, type ReactNode } from 'react'
import styles from './Modal.module.css'

interface ModalProps {
  title: string
  children: ReactNode
}

/**
 * Deliberately has no `onClose` for now — the brief says the modal never
 * closes. The close button stays visible (it is in the design) but is marked
 * `aria-disabled` rather than `disabled`, so keyboard users can still reach
 * the affordance they can see and hear why it does nothing.
 *
 * `aria-modal` holds in this demo because the dialog is the entire page, so
 * nothing focusable exists outside it. Embedded in a real page this must
 * become a native `<dialog>` with `showModal()` (or gain a focus trap),
 * otherwise Tab walks out into content that AT was told is inert.
 */
export function Modal({ title, children }: ModalProps) {
  const headingId = useId()
  const headingRef = useRef<HTMLHeadingElement>(null)

  // Opening a dialog moves focus into it; the heading gives screen-reader
  // users the dialog's purpose as the first thing they hear.
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <div className={styles.backdrop}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
      >
        <div className={styles.header}>
          <h1
            id={headingId}
            ref={headingRef}
            tabIndex={-1}
            className={styles.title}
          >
            {title}
          </h1>
          <button
            type="button"
            className={styles.close}
            aria-label="Schließen"
            aria-disabled="true"
          >
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
  )
}
