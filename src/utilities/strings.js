function firstCharacter(word) {
  return word.charAt(0);
}

function lastCharacter(word) {
  return word.charAt(word.length - 1);
}

function trimFirstCharacter(word) {
  return word.substring(1);
}

function trimLastCharacter(word) {
  return word.substring(0, word.length - 1);
}

module.exports = {
  firstCharacter,
  lastCharacter,
  trimFirstCharacter,
  trimLastCharacter
};