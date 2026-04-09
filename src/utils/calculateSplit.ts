import type { CryptoOption, SplitAllocation } from '../types'

export interface SplitInput {
  totalUsd: number
  allocations: Array<{
    crypto: CryptoOption
    percentage: number       // must sum to 100
    ratePerDollar: number    // how much crypto per 1 USD
  }>
}

/**
 * Calculates how much of each crypto to buy given a USD total,
 * percentage split, and exchange rates.
 *
 * Pure function — no side effects, fully unit-testable.
 */
export function calculateSplit(input: SplitInput): SplitAllocation[] {
  const { totalUsd, allocations } = input

  return allocations.map((alloc) => {
    const usdAmount = (alloc.percentage / 100) * totalUsd
    const cryptoAmount = usdAmount * alloc.ratePerDollar

    return {
      crypto: alloc.crypto,
      percentage: alloc.percentage,
      usdAmount,
      cryptoAmount,
      ratePerDollar: alloc.ratePerDollar,
    }
  })
}
