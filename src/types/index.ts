export interface CryptoOption {
  symbol: string   // e.g. "BTC"
  name: string     // e.g. "Bitcoin"
}

export interface SplitAllocation {
  crypto: CryptoOption
  percentage: number      // 0–100
  usdAmount: number       // USD portion allocated
  cryptoAmount: number    // how many units of the crypto
  ratePerDollar: number   // exchange rate used
}

export interface ExchangeRates {
  [symbol: string]: string  // Coinbase returns rates as strings
}
