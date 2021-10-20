// Currency formatter
export const currencyFormatter = (data) => {
  return ((data.amount * 100) / 100).toLocaleString(data.currency, {
    style: 'currency',
    currency: data.currency,
  });
};

// Stripe currency formatter
export const stripeCurrencyFormatter = (data) => {
  return (data.amount / 100).toLocaleString(data.currency, {
    style: 'currency',
    currency: data.currency,
  });
};
