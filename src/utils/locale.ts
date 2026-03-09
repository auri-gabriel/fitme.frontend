const MARKET_LOCALE = import.meta.env.VITE_MARKET_LOCALE || 'en-GB';
const MARKET_CURRENCY = import.meta.env.VITE_MARKET_CURRENCY || 'GBP';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat(MARKET_LOCALE, {
    style: 'currency',
    currency: MARKET_CURRENCY,
    maximumFractionDigits: 2,
  }).format(value);
};

export const normalizeCurrencyText = (text: string): string => {
  if (!text) {
    return text;
  }

  return text
    .replace(/₹\s*(\d+(?:\.\d+)?)/g, (_, amount) =>
      formatCurrency(Number(amount)),
    )
    .replace(/\bINR\b/gi, MARKET_CURRENCY);
};
