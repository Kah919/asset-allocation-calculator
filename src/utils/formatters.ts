export function formatCrypto(amount: number): string {
  if (amount === 0) return '0'
  if (amount >= 1) return amount.toLocaleString(undefined, { maximumFractionDigits: 6 })
  return amount.toLocaleString(undefined, { maximumFractionDigits: 8 })
}

export function formatUsd(amount: number): string {
  return amount.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
