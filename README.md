# Neues Update erstellen

A petition update creation form, built with React, TypeScript and plain CSS.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run test` | Run the unit tests once |
| `npm run test:watch` | Run the unit tests in watch mode |
| `npm run lint` | ESLint |

## What it does

- **Title** — text input, capped at 100 characters.
- **Content** — textarea for the update itself, capped at 10.000 characters.
- **Author** — pre-filled with the petition starter's name and read-only. The
  "Absender ändern" toggle makes it editable so the update can be published
  under a different name.
- **Character counters** — live counts under the title and content fields,
  formatted with German thousands separators.
- **Validation** — no field may be empty; whitespace-only input counts as empty.
  Errors appear inline per field plus a summary at the bottom.
- **Entwurf speichern** — on success, writes the draft to Local Storage under
  the key `petition-update-draft` and shows a confirmation at the bottom of the
  modal.
- **The modal never closes** — not via the close button, not via the backdrop,
  not via Escape, as required by the brief. "Abbrechen" and
  "Update veröffentlichen" are intentionally inert.

The stored object:

```ts
{
  title: string
  content: string
  author: string
  hasCustomAuthor: boolean  // false when published under the starter's own name
  savedAt: string           // ISO timestamp
}
```

## Structure

```
src/
├── App.tsx                  Composes the modal and the form
├── constants.ts             Character limits, default author, storage key
├── types.ts                 Form and draft types
├── components/
│   ├── Modal.tsx            Permanently open dialog shell
│   ├── UpdateForm.tsx       Form state, validation and saving
│   ├── Toggle.tsx           Accessible switch
│   ├── CharacterCounter.tsx Live character count
│   └── Button.tsx           Three button variants
└── lib/
    ├── validation.ts        Pure validation rules
    ├── storage.ts           Local Storage boundary
    └── format.ts            German number and time formatting
```

## Notable decisions

**Validation lives in a pure function.** `validateForm` takes values and returns
a message per invalid field, with no knowledge of React. That keeps it trivially
testable and makes "is this form submittable" answerable in one place. The
inputs also carry `maxLength`, but that attribute does not apply to
programmatically set values, so the limits are re-checked there.

**The custom author is stored separately from the default.** Toggling
"Absender ändern" off and on again preserves whatever was typed rather than
discarding it, which avoids punishing an accidental toggle.

**Feedback is cleared on edit.** A success confirmation describes a specific
saved state, so any subsequent keystroke hides it again. Field errors disappear
as soon as that field is corrected rather than waiting for the next submit.

**Local Storage is treated as a failable boundary.** It throws in Safari's
private mode and when the quota is exceeded, so the write is wrapped and the
failure is surfaced instead of silently losing the draft.

**Errors validate on submit, then live.** Validating while the user is still
typing their first character is noisy; validating only on submit means they
cannot tell whether a fix worked. Submit-then-live is the middle ground.

**Accessibility.** The dialog is labelled by its heading and moves focus to it
on open; a failed submit moves focus to the first invalid field. Counters are
linked to their inputs via `aria-describedby` (rather than a live region, which
would announce on every keystroke), invalid fields carry `aria-invalid`, the
toggle is a real checkbox with `role="switch"`, and focus moves into the author
field the moment it becomes editable. The close button uses `aria-disabled`
instead of `disabled`, so keyboard users can still reach the affordance they can
see. `aria-modal` holds here because the dialog is the entire page; embedded in
a real page it would need a focus trap (ideally a native `<dialog>` with
`showModal()`).

**Styling** is plain CSS via CSS Modules — scoped class names and no extra
dependency. Colours, the type scale and radii live as custom properties in
`src/index.css` and are taken from Figma's Dev Mode, so the token names map back to the design (`--font-size-title-sm` ≙ `Font/size/Title sm`). Layout is
responsive: the action buttons stack once the modal is too narrow for one row.
Given the time constraints I refrained from using a CSS library. While I work with Tailwind right now, I do feel it creates visual clutter and makes code harder to understand for humans.


## What I would do next if I had more time
- **Restore the draft on load**
  "Entwurf speichern" currently writes data nobody ever sees again.Pre-filling the form from Local Storage on mount (plus a "draft from *time* restored" note) would complete the feature.
- **Adding internationalization.**
  One of the biggest issue in my opinion. Hard coding values is never a good or sustainable idea
- **Warning before closing the modal and losing unsaved changes**
- **Adding End-to-end tests**
- **Use Prettier from the beginning (obviously)**

## Tests

31 tests with Vitest and Testing Library, covering the validation rules, the
character limits and counters, the author toggle's read-only and restore
behaviour, the Local Storage write, and the requirement that the modal stays
open. Tests query by role and label rather than by class, so they describe
behaviour instead of markup.

```bash
npm run test
```
