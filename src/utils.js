export function formatScore(score) {
  if (score < 0) return `-$${Math.abs(score).toLocaleString()}`
  return `$${score.toLocaleString()}`
}
