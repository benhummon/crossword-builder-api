function arrayOfSize(n) {
  return Array(n).fill(null);
}

function arrayShallowEquivalent(a, b) {
  if (! a && ! b) return true;
  if (! a || ! b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function indicesArray(a, b) {
  if (typeof a !== 'number') {
    throw new Error('indicesArray requires one or two number arguments');
  }
  if (typeof b !== 'number') return buildIndicesArray(0, a);
  return buildIndicesArray(a, b);
}

function inclusiveIndicesArray(from, to) {
  if (typeof from !== 'number' || typeof to !== 'number') {
    throw new Error('inclusiveIndicesArray requires two number arguments');
  }
  return buildInclusiveIndicesArray(from, to);
}

function buildIndicesArray(from, to) {
  const array = [];
  for (let i = from; i < to; i++) {
    array.push(i);
  }
  return array;
}

function buildInclusiveIndicesArray(from, to) {
  const array = [];
  for (let i = from; i <= to; i++) {
    array.push(i);
  }
  return array;
}

module.exports = {
  arrayOfSize,
  arrayShallowEquivalent,
  indicesArray,
  inclusiveIndicesArray,
};