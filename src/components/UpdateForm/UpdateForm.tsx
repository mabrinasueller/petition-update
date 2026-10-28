import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '../Button/Button';
import { Toggle } from '../Toggle/Toggle';
import styles from './UpdateForm.module.css';

const TITLE_MAX_LENGTH = 100;
const CONTENT_MAX_LENGTH = 10000;
const DEFAULT_AUTHOR = 'Petra Petitionsstarterin';

const formatCount = (value: number) => value.toLocaleString('de-DE');

export function UpdateForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hasCustomAuthor, setHasCustomAuthor] = useState(false);
  const [customAuthor, setCustomAuthor] = useState('');

  const authorInputRef = useRef<HTMLInputElement>(null);

  const titleId = useId();
  const titleCounterId = useId();
  const contentId = useId();
  const contentCounterId = useId();
  const authorId = useId();
  const authorToggleId = useId();

  useEffect(() => {
    if (hasCustomAuthor) {
      authorInputRef.current?.focus();
    }
  }, [hasCustomAuthor]);

  return (
    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor={titleId}>
          Titel
        </label>
        <input
          id={titleId}
          className={styles.input}
          type="text"
          value={title}
          maxLength={TITLE_MAX_LENGTH}
          aria-describedby={titleCounterId}
          onChange={(event) => setTitle(event.target.value)}
        />
        <p id={titleCounterId} className={styles.counter} aria-live="polite">
          {formatCount(title.length)} / {formatCount(TITLE_MAX_LENGTH)} Zeichen
        </p>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={contentId}>
          Deine Neuigkeiten
        </label>
        <textarea
          id={contentId}
          className={styles.textarea}
          value={content}
          rows={5}
          maxLength={CONTENT_MAX_LENGTH}
          placeholder="Bitte schreibe ein paar Worte zu deinem Update."
          aria-describedby={contentCounterId}
          onChange={(event) => setContent(event.target.value)}
        />
        <p id={contentCounterId} className={styles.counter} aria-live="polite">
          {formatCount(content.length)} / {formatCount(CONTENT_MAX_LENGTH)} Zeichen
        </p>
      </div>

      <div className={styles.field}>
        <div className={styles.authorHeader}>
          <span className={styles.label}>Absender</span>
          <Toggle
            id={authorToggleId}
            label="Absender ändern"
            checked={hasCustomAuthor}
            onChange={setHasCustomAuthor}
          />
        </div>
        
        <p className={styles.hint}>
          Hier hast du die Option, das Update unter einem anderen Namen zu veröffentlichen.
        </p>
        
        <label className={styles.smallLabel} htmlFor={authorId}>
          Absender
        </label>
        <input
          id={authorId}
          ref={authorInputRef}
          className={styles.input}
          type="text"
          value={hasCustomAuthor ? customAuthor : DEFAULT_AUTHOR}
          readOnly={!hasCustomAuthor}
          data-readonly={!hasCustomAuthor || undefined}
          placeholder={hasCustomAuthor ? 'z. B. Initiative Stadtgrün' : undefined}
          onChange={(event) => setCustomAuthor(event.target.value)}
        />
      </div>

      <div className={styles.actions} role="group" aria-label="Aktionen für Beitrag">
        <Button type="button" variant="outline">
          Abbrechen
        </Button>
        <Button type="submit" variant="primary">
          Entwurf speichern
        </Button>
        <Button type="submit" variant="accent">
          Update veröffentlichen
        </Button>
      </div>
    </form>
  );
}
