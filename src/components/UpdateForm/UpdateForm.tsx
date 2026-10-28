import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import {
  CONTENT_MAX_LENGTH,
  DEFAULT_AUTHOR,
  TITLE_MAX_LENGTH,
} from '../../constants'
import { hasErrors, validateForm } from '../../lib/validation'
import type { FieldName, FormErrors } from '../../types'
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

  const authorInputRef = useRef<HTMLInputElement>(null)
  const ids = useFieldIds()

  const author = hasCustomAuthor ? customAuthor : DEFAULT_AUTHOR

  useEffect(() => {
    if (hasCustomAuthor) {
      authorInputRef.current?.focus()
    }
  }, [hasCustomAuthor])

  function clearError(field: FieldName) {
    setErrors((previous) => {
      if (previous[field] === undefined) return previous
      const next = { ...previous }
      delete next[field]
      return next
    })
  }

  function handleToggleAuthor(checked: boolean) {
    setHasCustomAuthor(checked)
    clearError('author')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrors(validateForm({ title, content, author }))
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor={ids.title}>
          Titel
        </label>
        <input
          id={ids.title}
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
            clearError('title')
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
            clearError('content')
          }}
        />
        <CharacterCounter
          id={ids.contentCounter}
          current={content.length}
          max={CONTENT_MAX_LENGTH}
        />
        <FieldError id={ids.contentError} message={errors.content} />
      </div>

      <div className={styles.field}>
        <div className={styles.authorHeader}>
          <span className={styles.label}>Absender</span>
          <Toggle
            id={ids.authorToggle}
            label="Absender ändern"
            checked={hasCustomAuthor}
            onChange={handleToggleAuthor}
          />
        </div>
        <p className={styles.hint}>
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
          placeholder={hasCustomAuthor ? 'z. B. Initiative Stadtgrün' : undefined}
          aria-describedby={errors.author ? ids.authorError : undefined}
          aria-invalid={errors.author ? true : undefined}
          onChange={(event) => {
            setCustomAuthor(event.target.value)
            clearError('author')
          }}
        />
        <FieldError id={ids.authorError} message={errors.author} />
      </div>

      <div className={styles.actions}>
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
    authorToggle: `${prefix}-author-toggle`,
    authorError: `${prefix}-author-error`,
  }
}
