export interface ValidatorInput {
  totalUsd: string
  percentA: string
  percentB: string
  symbolA: string
  symbolB: string
}

export function validateCalculatorInput(input: ValidatorInput): string | null {
  const usd = parseFloat(input.totalUsd)
  const pA = parseFloat(input.percentA)
  const pB = parseFloat(input.percentB)

  if (!input.totalUsd || isNaN(usd)) return 'Please enter a valid USD amount.'
  if (usd <= 0) return 'USD amount must be greater than zero.'
  if (isNaN(pA) || isNaN(pB)) return 'Both percentage fields must be filled in.'
  if (pA < 0 || pB < 0) return 'Percentages cannot be negative.'

  const sum = parseFloat((pA + pB).toFixed(2))
  if (sum !== 100) return `Percentages must sum to 100% (currently ${sum}%).`

  if (input.symbolA === input.symbolB) return 'Please select two different cryptocurrencies.'

  return null
}
