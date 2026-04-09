import { describe, it, expect } from 'vitest'
import { calculateSplit } from './calculateSplit'

const BTC = { symbol: 'BTC', name: 'Bitcoin' }
const ETH = { symbol: 'ETH', name: 'Ethereum' }

describe('calculateSplit', () => {
  it('calculates a 70/30 split correctly', () => {
    const results = calculateSplit({
      totalUsd: 1000,
      allocations: [
        { crypto: BTC, percentage: 70, ratePerDollar: 0.001 },
        { crypto: ETH, percentage: 30, ratePerDollar: 0.0005 },
      ],
    })

    expect(results[0].usdAmount).toBe(700)
    expect(results[0].cryptoAmount).toBeCloseTo(0.7, 6)

    expect(results[1].usdAmount).toBe(300)
    expect(results[1].cryptoAmount).toBeCloseTo(0.15, 6)
  })

  it('returns zero crypto when USD total is 0', () => {
    const results = calculateSplit({
      totalUsd: 0,
      allocations: [
        { crypto: BTC, percentage: 70, ratePerDollar: 0.001 },
        { crypto: ETH, percentage: 30, ratePerDollar: 0.0005 },
      ],
    })

    expect(results[0].cryptoAmount).toBe(0)
    expect(results[1].cryptoAmount).toBe(0)
  })

  it('handles a 50/50 split correctly', () => {
    const results = calculateSplit({
      totalUsd: 500,
      allocations: [
        { crypto: BTC, percentage: 50, ratePerDollar: 0.001 },
        { crypto: ETH, percentage: 50, ratePerDollar: 0.0005 },
      ],
    })

    expect(results[0].usdAmount).toBe(250)
    expect(results[1].usdAmount).toBe(250)
    expect(results[0].cryptoAmount).toBeCloseTo(0.25, 6)
    expect(results[1].cryptoAmount).toBeCloseTo(0.125, 6)
  })

  it('preserves crypto metadata on each result', () => {
    const results = calculateSplit({
      totalUsd: 1000,
      allocations: [
        { crypto: BTC, percentage: 70, ratePerDollar: 0.001 },
        { crypto: ETH, percentage: 30, ratePerDollar: 0.0005 },
      ],
    })

    expect(results[0].crypto.symbol).toBe('BTC')
    expect(results[1].crypto.symbol).toBe('ETH')
    expect(results[0].percentage).toBe(70)
    expect(results[1].percentage).toBe(30)
  })
})
