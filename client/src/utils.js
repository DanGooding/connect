
// are these Sets equal?
function setEq(a, b) {
  if (a.size !== b.size) return false;
  for (let x of a) {
    if (!b.has(x)) return false;
  }
  return true;
}

// return a random integer in [min, max)
function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// shuffle an array in place
function shuffle(a) {
  for (let i = 0; i < a.length; i++) {
    const j = randomInt(i, a.length);
    [a[i], a[j]] = [a[j], a[i]];
  }
}

function pluralise(word, count, plural = null) {
  if (plural == null) {
    plural = `${word}s`;
  }
  return count === 1 ? word : plural;
}

function capitalise(word) {
  return word[0].toUpperCase() + word.slice(1);
}

export {
  setEq,
  shuffle,
  pluralise,
  capitalise
};
