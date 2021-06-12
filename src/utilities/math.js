function isNumber(anything) {
  if (isNaN(anything)) return false;
  return typeof anything === 'number';
}

function remainderAndQuotient(numerator, denominator) {
  const remainder = numerator % denominator;
  const quotient = (numerator - remainder) / denominator;
  return [remainder, quotient];
}

module.exports = { isNumber, remainderAndQuotient };
