import { useId, useState } from "react";
import styles from "./UpdateForm.module.css";

const TITLE_MAX_LENGTH = 100;

export function UpdateForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const titleId = useId();
  const contentId = useId();

  return (
    <form className={styles.form}>
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
          onChange={(event) => setTitle(event.target.value)}
        />
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
          placeholder="Bitte schreibe ein paar Worte zu deinem Update."
          onChange={(event) => setContent(event.target.value)}
        />
      </div>
    </form>
  );
}
