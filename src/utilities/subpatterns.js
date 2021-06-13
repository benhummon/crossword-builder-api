function computeSubpatterns(pattern) {
  const subpatterns = computeSubpatternsTrimLeft(pattern).flatMap(
    subpattern => computeSubpatternsTrimRight(subpattern)
  );
  subpatterns.sort(
    (subpatternA, subpatternB) => subpatternA.length - subpatternB.length
  );
  return subpatterns;
}

function computeSubpatternsTrimLeft(pattern) {
  const index = findIndex(pattern);
  const trimPoints = [];
  for (let i = 0; i < index; i++) {
    if (pattern[i] === '.') trimPoints.push(i + 1);
  }
  trimPoints.unshift(0);
  return trimPoints.reverse().map(
    trimPoint => pattern.substring(trimPoint)
  );
}

function computeSubpatternsTrimRight(pattern) {
  const index = findIndex(pattern);
  const trimPoints = [];
  for (let i = index + 1; i < pattern.length; i++) {
    if (pattern[i] === '.') trimPoints.push(i);
  }
  trimPoints.push(pattern.length);
  return trimPoints.map(
    trimPoint => pattern.substring(0, trimPoint)
  );
}

function findIndex(pattern) {
  const index = pattern.indexOf('@');
  if (index === -1) {
    throw new Error('Did not find @ in pattern');
  }
  if (pattern.indexOf('@', index + 1) !== -1) {
    throw new Error('Found multiple @ in pattern');
  }
  return index;
}

module.exports = {
  computeSubpatterns,
  computeSubpatternsTrimLeft,
  computeSubpatternsTrimRight
};