
import lcs from './lcs';

it('returns zero for empty strings', () => {
  expect(lcs('', '')).toBe(0);
  expect(lcs('hello', '')).toBe(0);
  expect(lcs('', 'world')).toBe(0);
});

it('gives length for equal arguments', () => {
  expect(lcs('a', 'a')).toBe(1);
  expect(lcs('abcdefghijklmnopqrstuvwxyz', 'abcdefghijklmnopqrstuvwxyz')).toBe(26);
});

it('is correct for substring', () => {
  expect(lcs('banana', 'ana')).toBe(3);
  expect(lcs('23456', '0123456789')).toBe(5);
});

it('is correct for non substring', () => {
  expect(lcs('amputation', 'sprain')).toBe(4); // 'pain'
});

