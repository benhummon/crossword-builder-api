function isNumber(anything) {
  if (isNaN(anything)) return false;
  if (anything === Infinity) return false;
  if (anything === - Infinity) return false;
  return typeof anything === 'number';
}

function remainderAndQuotient(numerator, denominator) {
  if (denominator === 0) throw Error('Cannot divide by zero');
  if (numerator < 0 || denominator < 0) throw Error('Expected positive arguments');
  const remainder = numerator % denominator;
  const quotient = (numerator - remainder) / denominator;
  return [remainder, quotient];
}

module.exports = { isNumber, remainderAndQuotient };
