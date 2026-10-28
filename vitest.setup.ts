import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// `globals` is off, so React Testing Library cannot hook into `afterEach`
// by itself — unmounting between tests has to be wired up explicitly.
afterEach(cleanup)
