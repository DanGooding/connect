
import lcs from './lcs';

// return an array of all words & numbers
// converted to lowercase and with apostrophes removed
function getWords(sentence: string): Array<string> {
  const matches =
    sentence
      .toLowerCase()
      .replace('\'', '')
      .matchAll(/[a-z0-9]+/g);
  return Array.from(
    matches,
    ([word]) => word);
}

// words longer than 2 letters that sill arent useful
const stopWords = ['all', 'the', 'are', 'have', 'this', 'that', 'types', 'there', 'from', 'for', 'words', 'things'];

// is this word useful in marking an answer ?
function isUsefulWord(word: string): boolean {
  return word.length > 2 && !stopWords.includes(word);
}

// return array of only the 'useful' words in `sentence`,
// or if no words are 'useful', then returns all words
function getNonUseless(sentence: string): Array<string> {
  const words = getWords(sentence);
  const onlyUseful = words.filter(isUsefulWord);
  if (onlyUseful.length === 0) {
    return words;
  }
  return onlyUseful;
}

// are these words considered similar enough to match
// allows pluralisation and slightly different forms
function areSimilar(s: string, t: string): boolean {
  if (s === t) return true;
  const similarity = lcs(s, t) / Math.max(s.length, t.length);
  return similarity >= 0.7;
}

// does the guess (at what the connection is) match the answer
function markConnectionGuess(guess: string, answer: string): boolean {
  const guessWords = getNonUseless(guess);
  const answerWords = getNonUseless(answer);

  for (const answerWord of answerWords) {
    // this word must appear in the guess
    if (!guessWords.some(guessWord => areSimilar(guessWord, answerWord))) {
      return false;
    }
  }
  return true;
}

export default markConnectionGuess;
