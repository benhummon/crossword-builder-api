const { indicesArray } = require('./arrays');

function buildLowercaseAlphabet() {
  const charCode = 'a'.charCodeAt(0);
  return indicesArray(26).map(
    i => String.fromCharCode(charCode + i)
  );
}

function buildUppercaseAlphabet() {
  const charCode = 'A'.charCodeAt(0);
  return indicesArray(26).map(
    i => String.fromCharCode(charCode + i)
  );
}

function isLetter(string) {
  return /^[A-Za-z]$/.test(string);
}

const filledSquareCharacter = '~';

module.exports = {
  buildLowercaseAlphabet,
  buildUppercaseAlphabet,
  isLetter,
  filledSquareCharacter
};