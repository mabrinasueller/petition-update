import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import {
  CONTENT_MAX_LENGTH,
  DEFAULT_AUTHOR,
  TITLE_MAX_LENGTH,
} from '../../constants'
import { formatTime } from '../../lib/format'
import { saveDraft } from '../../lib/storage'
import { hasErrors, validateForm } from '../../lib/validation'
import type { FieldName, FormErrors, PetitionUpdateDraft } from '../../types'
import { Button } from '../Button/Button'
import { CharacterCounter } from '../CharacterCounter/CharacterCounter'
import { Toggle } from '../Toggle/Toggle'
import styles from './UpdateForm.module.css'

export function UpdateForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [hasCustomAuthor, setHasCustomAuthor] = useState(false)
  const [customAuthor, setCustomAuthor] = useState('')

  const [errors, setErrors] = useState<FormErrors>({})
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [storageError, setStorageError] = useState<string | null>(null)

  const titleInputRef = useRef<HTMLInputElement>(null)
  const contentInputRef = useRef<HTMLTextAreaElement>(null)
  const authorInputRef = useRef<HTMLInputElement>(null)
  const ids = useFieldIds()

  const author = hasCustomAuthor ? customAuthor : DEFAULT_AUTHOR

  useEffect(() => {
    if (hasCustomAuthor) {
      authorInputRef.current?.focus()
    }
  }, [hasCustomAuthor])

  function clearFeedback(field: FieldName) {
    setSavedAt(null)
    setStorageError(null)
    setErrors((previous) => {
      if (previous[field] === undefined) return previous
      const next = { ...previous }
      delete next[field]
      return next
    })
  }

  function handleToggleAuthor(checked: boolean) {
    setHasCustomAuthor(checked)
    clearFeedback('author')
  }

  function handleSaveDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validateForm({ title, content, author })
    setErrors(nextErrors)

    if (hasErrors(nextErrors)) {
      setSavedAt(null)
      setStorageError(null)
      focusFirstInvalidField(nextErrors)
      return
    }

    const draft: PetitionUpdateDraft = {
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      hasCustomAuthor,
      savedAt: new Date().toISOString(),
    }

    try {
      saveDraft(draft)
      setSavedAt(draft.savedAt)
      setStorageError(null)
    } catch {
      setSavedAt(null)
      setStorageError(
        'Dein Entwurf konnte nicht gespeichert werden. Bitte prüfe die Speicher-Einstellungen deines Browsers.',
      )
    }
  }

  /**
   * After a failed submit, a sighted user sees the red fields — a keyboard or
   * screen-reader user is still parked on the button. Moving focus to the
   * first invalid field (in visual order) takes them straight to the problem
   * and announces its error via `aria-describedby`.
   */
  function focusFirstInvalidField(nextErrors: FormErrors) {
    const fieldRefs = {
      title: titleInputRef,
      content: contentInputRef,
      author: authorInputRef,
    }
    const firstInvalid = (['title', 'content', 'author'] as const).find(
      (field) => nextErrors[field],
    )
    if (firstInvalid) {
      fieldRefs[firstInvalid].current?.focus()
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSaveDraft} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor={ids.title}>
          Titel
        </label>
        <input
          id={ids.title}
          ref={titleInputRef}
          className={styles.input}
          type="text"
          value={title}
          maxLength={TITLE_MAX_LENGTH}
          aria-describedby={describedBy(
            ids.titleCounter,
            errors.title && ids.titleError,
          )}
          aria-invalid={errors.title ? true : undefined}
          onChange={(event) => {
            setTitle(event.target.value)
            clearFeedback('title')
          }}
        />
        <CharacterCounter
          id={ids.titleCounter}
          current={title.length}
          max={TITLE_MAX_LENGTH}
        />
        <FieldError id={ids.titleError} message={errors.title} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={ids.content}>
          Deine Neuigkeiten
        </label>
        <textarea
          id={ids.content}
          ref={contentInputRef}
          className={styles.textarea}
          value={content}
          rows={5}
          maxLength={CONTENT_MAX_LENGTH}
          placeholder="Bitte schreibe ein paar Worte zu deinem Update."
          aria-describedby={describedBy(
            ids.contentCounter,
            errors.content && ids.contentError,
          )}
          aria-invalid={errors.content ? true : undefined}
          onChange={(event) => {
            setContent(event.target.value)
            clearFeedback('content')
          }}
        />
        <CharacterCounter
          id={ids.contentCounter}
          current={content.length}
          max={CONTENT_MAX_LENGTH}
        />
        <FieldError id={ids.contentError} message={errors.content} />
      </div>

      {/* Semantically a fieldset, but a real <legend> cannot sit in the flex
          header row next to the toggle, so the grouping is expressed via
          role="group" instead — identical in the accessibility tree. */}
      <div
        className={styles.field}
        role="group"
        aria-labelledby={ids.authorGroup}
      >
        <div className={styles.authorHeader}>
          <span id={ids.authorGroup} className={styles.label}>
            Absender
          </span>
          <Toggle
            id={ids.authorToggle}
            label="Absender ändern"
            checked={hasCustomAuthor}
            describedBy={ids.authorHint}
            onChange={handleToggleAuthor}
          />
        </div>
        <p id={ids.authorHint} className={styles.hint}>
          Hier hast du die Option, das Update unter einem anderen Namen zu
          veröffentlichen.
        </p>
        <label className={styles.smallLabel} htmlFor={ids.author}>
          Absender
        </label>
        <input
          id={ids.author}
          ref={authorInputRef}
          className={styles.input}
          data-readonly={!hasCustomAuthor || undefined}
          type="text"
          value={author}
          readOnly={!hasCustomAuthor}
          placeholder={
            hasCustomAuthor ? 'z. B. Initiative Stadtgrün' : undefined
          }
          aria-describedby={describedBy(
            ids.authorHint,
            errors.author && ids.authorError,
          )}
          aria-invalid={errors.author ? true : undefined}
          onChange={(event) => {
            setCustomAuthor(event.target.value)
            clearFeedback('author')
          }}
        />
        <FieldError id={ids.authorError} message={errors.author} />
      </div>

      <div className={styles.actions}>
        {/* "Abbrechen" and "Update veröffentlichen" are intentionally inert:
            the brief only asks for saving a draft, and the modal never
            closes. They stay enabled because the design shows them as active. */}
        <Button type="button" variant="outline">
          Abbrechen
        </Button>
        <Button type="submit" variant="primary">
          Entwurf speichern
        </Button>
        <Button type="button" variant="accent">
          Update veröffentlichen
        </Button>
      </div>

      <div className={styles.feedback}>
        {savedAt && (
          <p className={styles.success} role="status">
            <CheckIcon />
            Dein Entwurf wurde um {formatTime(savedAt)} Uhr gespeichert.
          </p>
        )}
        {storageError && (
          <p className={styles.formError} role="alert">
            {storageError}
          </p>
        )}
        {hasErrors(errors) && (
          <p className={styles.formError} role="alert">
            Bitte fülle alle Felder aus, um deinen Entwurf zu speichern.
          </p>
        )}
      </div>
    </form>
  )
}

function describedBy(...ids: (string | false | undefined)[]) {
  const present = ids.filter(Boolean)
  return present.length > 0 ? present.join(' ') : undefined
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className={styles.fieldError}>
      {message}
    </p>
  )
}

function CheckIcon() {
  return (
    <svg
      className={styles.checkIcon}
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3 8.5 L6.5 12 L13 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function useFieldIds() {
  const prefix = useId()
  return {
    title: `${prefix}-title`,
    titleCounter: `${prefix}-title-counter`,
    titleError: `${prefix}-title-error`,
    content: `${prefix}-content`,
    contentCounter: `${prefix}-content-counter`,
    contentError: `${prefix}-content-error`,
    author: `${prefix}-author`,
    authorGroup: `${prefix}-author-group`,
    authorHint: `${prefix}-author-hint`,
    authorToggle: `${prefix}-author-toggle`,
    authorError: `${prefix}-author-error`,
  }
}
