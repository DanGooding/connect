
// are these Sets equal?
function setEq<T>(a: Set<T>, b: Set<T>): boolean {
  if (a.size !== b.size) return false;
  for (let x of a) {
    if (!b.has(x)) return false;
  }
  return true;
}

// return a random integer in [min, max)
function randomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// shuffle an array in place
function shuffle<T>(a: Array<T>): void {
  for (let i = 0; i < a.length; i++) {
    const j = randomInt(i, a.length);
    [a[i], a[j]] = [a[j], a[i]];
  }
}

function repeat<T>(value: T, num: number): Array<T> {
  let arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(value);
  }
  return arr;
}

function pluralise(word: string, count: Number, plural: null|string = null): string {
  if (plural == null) {
    plural = `${word}s`;
  }
  return count === 1 ? word : plural;
}

function capitalise(word: string): string {
  return word[0].toUpperCase() + word.slice(1);
}

export {
  setEq,
  shuffle,
  repeat,
  pluralise,
  capitalise
};
