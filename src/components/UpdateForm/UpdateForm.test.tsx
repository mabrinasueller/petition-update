import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../../App'
import { DEFAULT_AUTHOR, STORAGE_KEY, TITLE_MAX_LENGTH } from '../../constants'
import type { PetitionUpdateDraft } from '../../types'
import { UpdateForm } from './UpdateForm'

function getTitleInput() {
  return screen.getByLabelText('Titel')
}

function getContentInput() {
  return screen.getByLabelText('Deine Neuigkeiten')
}

/** The author field and its section heading share the label text "Absender". */
function getAuthorInput() {
  return screen.getByRole('textbox', { name: 'Absender' })
}

function getSavedDraft(): PetitionUpdateDraft | null {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  return raw ? (JSON.parse(raw) as PetitionUpdateDraft) : null
}

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(getTitleInput(), 'Wir haben es geschafft')
  await user.type(getContentInput(), 'Danke für eure Unterstützung!')
}

describe('UpdateForm – validation', () => {
  it('does not save an empty form and explains why', async () => {
    const user = userEvent.setup()
    render(<UpdateForm />)

    await user.click(screen.getByRole('button', { name: 'Entwurf speichern' }))

    expect(screen.getByText(/Bitte gib deinem Update einen Titel/)).toBeVisible()
    expect(screen.getByText(/Bitte schreibe ein paar Worte/)).toBeVisible()
    expect(getSavedDraft()).toBeNull()
  })

  it('rejects whitespace-only input', async () => {
    const user = userEvent.setup()
    render(<UpdateForm />)

    await user.type(getTitleInput(), '   ')
    await user.type(getContentInput(), '   ')
    await user.click(screen.getByRole('button', { name: 'Entwurf speichern' }))

    expect(getSavedDraft()).toBeNull()
  })

  it('caps the title at the maximum length', async () => {
    const user = userEvent.setup()
    render(<UpdateForm />)

    const title = getTitleInput()
    expect(title).toHaveAttribute('maxlength', String(TITLE_MAX_LENGTH))

    await user.type(title, 'a'.repeat(TITLE_MAX_LENGTH + 10))

    expect(title).toHaveValue('a'.repeat(TITLE_MAX_LENGTH))
  })

  it('clears a field error as soon as the field is corrected', async () => {
    const user = userEvent.setup()
    render(<UpdateForm />)

    await user.click(screen.getByRole('button', { name: 'Entwurf speichern' }))
    expect(screen.getByText(/Bitte gib deinem Update einen Titel/)).toBeVisible()

    await user.type(getTitleInput(), 'Ein Titel')

    expect(
      screen.queryByText(/Bitte gib deinem Update einen Titel/),
    ).not.toBeInTheDocument()
  })
})

describe('UpdateForm – character counters', () => {
  it('counts the characters typed into the title', async () => {
    const user = userEvent.setup()
    render(<UpdateForm />)

    expect(screen.getByText('0 / 100 Zeichen')).toBeVisible()

    await user.type(getTitleInput(), 'Hallo')

    expect(screen.getByText('5 / 100 Zeichen')).toBeVisible()
  })

  it('formats the content limit with a German thousands separator', () => {
    render(<UpdateForm />)

    expect(screen.getByText('0 / 10.000 Zeichen')).toBeVisible()
  })
})

describe('UpdateForm – author toggle', () => {
  it('shows the petition starter as a read-only author by default', () => {
    render(<UpdateForm />)

    const author = getAuthorInput()
    expect(author).toHaveValue(DEFAULT_AUTHOR)
    expect(author).toHaveAttribute('readonly')
  })

  it('ignores typing while editing is disabled', async () => {
    const user = userEvent.setup()
    render(<UpdateForm />)

    await user.type(getAuthorInput(), 'Jemand anderes')

    expect(getAuthorInput()).toHaveValue(DEFAULT_AUTHOR)
  })

  it('allows a custom name once the toggle is switched on', async () => {
    const user = userEvent.setup()
    render(<UpdateForm />)

    await user.click(screen.getByRole('switch', { name: 'Absender ändern' }))
    const author = getAuthorInput()

    expect(author).not.toHaveAttribute('readonly')
    expect(author).toHaveValue('')

    await user.type(author, 'Initiative Stadtgrün')

    expect(author).toHaveValue('Initiative Stadtgrün')
  })

  it('restores the default name when the toggle is switched off again', async () => {
    const user = userEvent.setup()
    render(<UpdateForm />)
    const toggle = screen.getByRole('switch', { name: 'Absender ändern' })

    await user.click(toggle)
    await user.type(getAuthorInput(), 'Initiative Stadtgrün')
    await user.click(toggle)

    expect(getAuthorInput()).toHaveValue(DEFAULT_AUTHOR)

    // Switching back on keeps what was already typed.
    await user.click(toggle)
    expect(getAuthorInput()).toHaveValue('Initiative Stadtgrün')
  })

  it('requires a name when custom authoring is enabled but left empty', async () => {
    const user = userEvent.setup()
    render(<UpdateForm />)

    await fillRequiredFields(user)
    await user.click(screen.getByRole('switch', { name: 'Absender ändern' }))
    await user.click(screen.getByRole('button', { name: 'Entwurf speichern' }))

    expect(screen.getByText(/Bitte gib einen Absender an/)).toBeVisible()
    expect(getSavedDraft()).toBeNull()
  })
})

describe('UpdateForm – saving a draft', () => {
  it('confirms the save and stores the draft in Local Storage', async () => {
    const user = userEvent.setup()
    render(<UpdateForm />)

    await fillRequiredFields(user)
    await user.click(screen.getByRole('button', { name: 'Entwurf speichern' }))

    expect(screen.getByRole('status')).toHaveTextContent(
      /Dein Entwurf wurde um .* Uhr gespeichert/,
    )

    expect(getSavedDraft()).toMatchObject({
      title: 'Wir haben es geschafft',
      content: 'Danke für eure Unterstützung!',
      author: DEFAULT_AUTHOR,
      hasCustomAuthor: false,
    })
  })

  it('stores the custom author when one was entered', async () => {
    const user = userEvent.setup()
    render(<UpdateForm />)

    await fillRequiredFields(user)
    await user.click(screen.getByRole('switch', { name: 'Absender ändern' }))
    await user.type(getAuthorInput(), 'Initiative Stadtgrün')
    await user.click(screen.getByRole('button', { name: 'Entwurf speichern' }))

    expect(getSavedDraft()).toMatchObject({
      author: 'Initiative Stadtgrün',
      hasCustomAuthor: true,
    })
  })

  it('trims surrounding whitespace before storing', async () => {
    const user = userEvent.setup()
    render(<UpdateForm />)

    await user.type(getTitleInput(), '  Mit Leerzeichen  ')
    await user.type(getContentInput(), '  Inhalt  ')
    await user.click(screen.getByRole('button', { name: 'Entwurf speichern' }))

    expect(getSavedDraft()).toMatchObject({
      title: 'Mit Leerzeichen',
      content: 'Inhalt',
    })
  })

  it('hides the confirmation again once the draft is edited further', async () => {
    const user = userEvent.setup()
    render(<UpdateForm />)

    await fillRequiredFields(user)
    await user.click(screen.getByRole('button', { name: 'Entwurf speichern' }))
    expect(screen.getByRole('status')).toBeVisible()

    await user.type(getTitleInput(), ' mehr')

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})

describe('Modal', () => {
  it('stays open when any button inside it is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    for (const name of [
      'Abbrechen',
      'Update veröffentlichen',
      'Entwurf speichern',
      'Schließen',
    ]) {
      await user.click(screen.getByRole('button', { name }))
      expect(screen.getByRole('dialog')).toBeVisible()
    }
  })

  it('stays open when the backdrop or the Escape key is used', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)

    await user.click(container.firstElementChild as HTMLElement)
    expect(screen.getByRole('dialog')).toBeVisible()

    await user.keyboard('{Escape}')
    expect(screen.getByRole('dialog')).toBeVisible()
  })
})
