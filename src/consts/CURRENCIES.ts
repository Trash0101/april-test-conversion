export const CURRENCIES_TITLES = [
  { code: 'USD', name: 'Доллар США' },
  { code: 'EUR', name: 'Евро' },
  { code: 'RUB', name: 'Российский рубль' }
]

export const CURRENCIES_EXC_RATES = {
  RUB: { USD: 0.01094, EUR: 0.00983, RUB: 1 },
  USD: { RUB: 91.45, EUR: 0.89862, USD: 1 },
  EUR: { RUB: 101.74, USD: 1.1128, EUR: 1 },
}
