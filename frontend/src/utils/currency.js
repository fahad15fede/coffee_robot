// Currency utility for Pakistani Rupees (PKR)

export const formatCurrency = (amount) => {
  return `Rs ${parseFloat(amount).toFixed(2)}`;
};

export const CURRENCY_SYMBOL = 'Rs';
export const CURRENCY_CODE = 'PKR';
export const CURRENCY_NAME = 'Pakistani Rupees';
