import { describe, it, expect } from 'vitest'
import { formatCrypto, formatUsd } from './formatters'

describe('formatCrypto', () => {
  it('returns "0" for zero', () => {
    expect(formatCrypto(0)).toBe('0')
  })

  it('uses up to 6 decimal places for amounts >= 1', () => {
    expect(formatCrypto(1.123456789)).toBe('1.123457')
  })

  it('uses up to 8 decimal places for amounts < 1', () => {
    expect(formatCrypto(0.000123456789)).toBe('0.00012346')
  })
})

describe('formatUsd', () => {
  it('formats as USD currency with 2 decimal places', () => {
    expect(formatUsd(1000)).toBe('$1,000.00')
  })

  it('formats small amounts correctly', () => {
    expect(formatUsd(0.5)).toBe('$0.50')
  })

  it('always shows 2 decimal places', () => {
    expect(formatUsd(42)).toBe('$42.00')
  })
})
