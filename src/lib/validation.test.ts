import { describe, expect, it } from 'vitest'
import { CONTENT_MAX_LENGTH, TITLE_MAX_LENGTH } from '../constants'
import { hasErrors, validateForm } from './validation'

const validValues = {
  title: 'Wir haben 10.000 Unterschriften erreicht',
  content: 'Danke an alle, die unterschrieben haben!',
  author: 'Petra Petitionsstarterin',
}

describe('validateForm', () => {
  it('accepts a fully filled form', () => {
    expect(validateForm(validValues)).toEqual({})
  })

  it('rejects every empty field', () => {
    const errors = validateForm({ title: '', content: '', author: '' })

    expect(Object.keys(errors)).toEqual(['title', 'content', 'author'])
  })

  it('treats whitespace-only values as empty', () => {
    const errors = validateForm({ title: '   ', content: '\n\t', author: ' ' })

    expect(hasErrors(errors)).toBe(true)
    expect(Object.keys(errors)).toHaveLength(3)
  })

  it('rejects a title above the character limit', () => {
    const errors = validateForm({
      ...validValues,
      title: 'a'.repeat(TITLE_MAX_LENGTH + 1),
    })

    expect(errors.title).toMatch(/höchstens/)
  })

  it('accepts a title exactly at the character limit', () => {
    const errors = validateForm({
      ...validValues,
      title: 'a'.repeat(TITLE_MAX_LENGTH),
    })

    expect(errors.title).toBeUndefined()
  })

  it('rejects content above the character limit', () => {
    const errors = validateForm({
      ...validValues,
      content: 'a'.repeat(CONTENT_MAX_LENGTH + 1),
    })

    expect(errors.content).toMatch(/höchstens/)
  })
})

describe('hasErrors', () => {
  it('reports an empty error object as valid', () => {
    expect(hasErrors({})).toBe(false)
  })

  it('reports a populated error object as invalid', () => {
    expect(hasErrors({ title: 'fehlt' })).toBe(true)
  })

  it('handles fields with undefined values correctly', () => {
    expect(hasErrors({ title: undefined })).toBe(false)
  })
})
