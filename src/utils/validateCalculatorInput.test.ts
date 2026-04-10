import { describe, it, expect } from 'vitest'
import { validateCalculatorInput } from './validateCalculatorInput'

const valid = {
  totalUsd: 1000,
  percentA: 70,
  percentB: 30,
  symbolA: 'BTC',
  symbolB: 'ETH',
}

describe('validateCalculatorInput', () => {
  it('returns null for valid input', () => {
    expect(validateCalculatorInput(valid)).toBeNull()
  })

  it('rejects NaN USD (empty or non-numeric input)', () => {
    expect(validateCalculatorInput({ ...valid, totalUsd: NaN }))
      .toBe('Please enter a valid USD amount.')
  })

  it('rejects zero USD', () => {
    expect(validateCalculatorInput({ ...valid, totalUsd: 0 }))
      .toBe('USD amount must be greater than zero.')
  })

  it('rejects negative USD', () => {
    expect(validateCalculatorInput({ ...valid, totalUsd: -100 }))
      .toBe('USD amount must be greater than zero.')
  })

  it('rejects NaN percentages (empty input)', () => {
    expect(validateCalculatorInput({ ...valid, percentA: NaN }))
      .toBe('Both percentage fields must be filled in.')
    expect(validateCalculatorInput({ ...valid, percentB: NaN }))
      .toBe('Both percentage fields must be filled in.')
  })

  it('rejects negative percentages', () => {
    expect(validateCalculatorInput({ ...valid, percentA: -10, percentB: 110 }))
      .toBe('Percentages cannot be negative.')
  })

  it('rejects percentages that do not sum to 100', () => {
    expect(validateCalculatorInput({ ...valid, percentA: 60, percentB: 60 }))
      .toBe('Percentages must sum to 100% (currently 120%).')
  })

  it('rejects same crypto for both slots', () => {
    expect(validateCalculatorInput({ ...valid, symbolA: 'BTC', symbolB: 'BTC' }))
      .toBe('Please select two different cryptocurrencies.')
  })
})
