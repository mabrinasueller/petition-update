import { CONTENT_MAX_LENGTH, TITLE_MAX_LENGTH } from '../constants';
import type { FormErrors, UpdateFormValues } from '../types';
import { formatNumber } from './format';

/** Whitespace-only input counts as empty - otherwise " " would pass as a title. */
function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

export function validateForm(values: UpdateFormValues): FormErrors {
  const errors: FormErrors = {};

  if (isBlank(values.title)) {
    errors.title = 'Bitte gib deinem Update einen Titel.';
  } else if (values.title.length > TITLE_MAX_LENGTH) {
    errors.title = `Der Titel darf höchstens ${formatNumber(TITLE_MAX_LENGTH)} Zeichen lang sein.`;
  }

  if (isBlank(values.content)) {
    errors.content = 'Bitte schreibe ein paar Worte zu deinem Update.';
  } else if (values.content.length > CONTENT_MAX_LENGTH) {
    errors.content = `Dein Update darf höchstens ${formatNumber(CONTENT_MAX_LENGTH)} Zeichen lang sein.`;
  }

  if (isBlank(values.author)) {
    errors.author = 'Bitte gib einen Absender an.';
  }

  return errors;
}

export function hasErrors(errors: FormErrors): boolean {
  return Object.values(errors).some((error) => error !== undefined);
}
