function remainderAndQuotient(numerator, denominator) {
  const remainder = numerator % denominator;
  const quotient = (numerator - remainder) / denominator;
  return [remainder, quotient];
}

module.exports = { remainderAndQuotient };
