import { COLORS, FONTS } from '../theme'
import { formatScore } from '../utils'

export default function WinnerScreen({ state }) {
  const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score)
  const winner = sortedPlayers[0]

  return (
    <div style={styles.screen}>
      <div style={styles.winnerName}>{winner.name.toUpperCase()}</div>
      <div style={styles.winnerScore}>{formatScore(winner.score)}</div>
      <div style={styles.divider} />
      {sortedPlayers.map((player) => (
        <div key={player.name} style={styles.row}>
          <span style={styles.playerName}>{player.name}</span>
          <span style={{ ...styles.playerScore, ...(player.score < 0 ? styles.negativeScore : {}) }}>
            {formatScore(player.score)}
          </span>
        </div>
      ))}
    </div>
  )
}

const styles = {
  screen: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    background: COLORS.background,
    padding: 40,
  },
  winnerName: {
    fontFamily: FONTS.heading,
    fontWeight: 700,
    fontSize: 'clamp(36px, 8vw, 96px)',
    color: COLORS.white,
    letterSpacing: 4,
  },
  winnerScore: {
    fontFamily: FONTS.heading,
    fontWeight: 700,
    fontSize: 52,
    color: COLORS.gold,
  },
  divider: {
    width: 300,
    height: 2,
    background: COLORS.tileBg,
    margin: '16px 0',
  },
  row: {
    display: 'flex',
    gap: 20,
    alignItems: 'center',
    width: 400,
  },
  playerName: {
    flex: 1,
    fontFamily: FONTS.heading,
    fontWeight: 600,
    fontSize: 28,
    color: COLORS.white,
    letterSpacing: 1,
  },
  playerScore: {
    fontFamily: FONTS.heading,
    fontWeight: 700,
    fontSize: 24,
    color: COLORS.gold,
  },
  negativeScore: {
    color: COLORS.negative,
  },
}
