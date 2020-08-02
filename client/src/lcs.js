
// return the length of the longest common subsequence of two strings
function lcs(s, t) {

  // lcs_prefix[i][j] is lcs(s[:i], t[:j])
  let lcs_prefix = [];
  for (let i = 0; i < s.length + 1; i++) {
    lcs_prefix.push([])
    for (let j = 0; j < t.length + 1; j++) {
      if (i === 0 || j === 0) {
        lcs_prefix[i].push(0);

      }else if (s[i - 1] === t[j - 1]) {
        // matching letter, extends lcs by 1
        lcs_prefix[i].push(lcs_prefix[i - 1][j - 1] + 1);

      }else {
        // distinct letters, can't both be included
        lcs_prefix[i].push(Math.max(lcs_prefix[i - 1][j], lcs_prefix[i][j - 1]));
      }
    }
  }

  return lcs_prefix[s.length][t.length];
}

export default lcs;
