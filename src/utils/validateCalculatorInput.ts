export interface ValidatorInput {
  totalUsd: number
  percentA: number
  percentB: number
  symbolA: string
  symbolB: string
}

export function validateCalculatorInput(input: ValidatorInput): string | null {
  if (isNaN(input.totalUsd)) return 'Please enter a valid USD amount.'
  if (input.totalUsd <= 0) return 'USD amount must be greater than zero.'
  if (isNaN(input.percentA) || isNaN(input.percentB)) return 'Both percentage fields must be filled in.'
  if (input.percentA < 0 || input.percentB < 0) return 'Percentages cannot be negative.'

  const sum = parseFloat((input.percentA + input.percentB).toFixed(2))
  if (sum !== 100) return `Percentages must sum to 100% (currently ${sum}%).`

  if (input.symbolA === input.symbolB) return 'Please select two different cryptocurrencies.'

  return null
}
