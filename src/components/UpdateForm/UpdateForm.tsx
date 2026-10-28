import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '../Button/Button';
import { CharacterCounter } from '../CharacterCounter/CharacterCounter';
import { Toggle } from '../Toggle/Toggle';
import styles from './UpdateForm.module.css';

const TITLE_MAX_LENGTH = 100;
const CONTENT_MAX_LENGTH = 10_000;
const DEFAULT_AUTHOR = 'Petra Petitionsstarterin';

export function UpdateForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hasCustomAuthor, setHasCustomAuthor] = useState(false);
  const [customAuthor, setCustomAuthor] = useState('');

  const authorInputRef = useRef<HTMLInputElement>(null);
  const ids = useFieldIds();

  useEffect(() => {
    if (hasCustomAuthor) {
      authorInputRef.current?.focus();
    }
  }, [hasCustomAuthor]);

  return (
    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
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
          aria-describedby={ids.titleCounter}
          onChange={(event) => setTitle(event.target.value)}
        />
        <CharacterCounter
          id={ids.titleCounter}
          current={title.length}
          max={TITLE_MAX_LENGTH}
        />
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
          aria-describedby={ids.contentCounter}
          onChange={(event) => setContent(event.target.value)}
        />
        <CharacterCounter
          id={ids.contentCounter}
          current={content.length}
          max={CONTENT_MAX_LENGTH}
        />
      </div>

      {/* Author Field Block */}
      <div className={styles.field}>
        <div className={styles.authorHeader}>
          <span className={styles.label}>Absender</span>
          <Toggle
            id={ids.authorToggle}
            label="Absender ändern"
            checked={hasCustomAuthor}
            onChange={setHasCustomAuthor}
          />
        </div>
        
        <p className={styles.hint}>
          Hier hast du die Option, das Update unter einem anderen Namen zu veröffentlichen.
        </p>
        
        <label className={styles.smallLabel} htmlFor={ids.author}>
          Absender
        </label>
        <input
          id={ids.author}
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
        <div className={styles.secondaryActions}>
          <Button type="button" variant="outline">
            Abbrechen
          </Button>
          <Button type="submit" variant="primary">
            Entwurf speichern
          </Button>
        </div>
        
        <Button type="submit" variant="accent">
          Update veröffentlichen
        </Button>
      </div>
    </form>
  );
}

function useFieldIds() {
  const prefix = useId();
  return {
    title: `${prefix}-title`,
    titleCounter: `${prefix}-title-counter`,
    content: `${prefix}-content`,
    contentCounter: `${prefix}-content-counter`,
    author: `${prefix}-author`,
    authorToggle: `${prefix}-author-toggle`,
  };
}
