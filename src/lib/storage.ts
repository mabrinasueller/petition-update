import { STORAGE_KEY } from '../constants'
import type { PetitionUpdateDraft } from '../types'

/**
 * Local Storage is a browser boundary that genuinely fails: Safari's private
 * mode and an exhausted quota both throw. Callers are expected to catch and
 * surface that to the user rather than silently losing the draft.
 */
export function saveDraft(draft: PetitionUpdateDraft): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
}