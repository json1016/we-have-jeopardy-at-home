import { COLORS, FONTS } from '../theme'
import { formatScore } from '../utils'

export default function Scoreboard({ players }) {
  return (
    <div style={styles.bar}>
      {players.map((player) => (
        <div key={player.name} style={styles.podium}>
          <div style={styles.name}>{player.name.toUpperCase()}</div>
          <div style={{ ...styles.score, ...(player.score < 0 ? styles.negativeScore : {}) }}>
            {formatScore(player.score)}
          </div>
        </div>
      ))}
    </div>
  )
}

const styles = {
  bar: {
    display: 'flex',
    background: COLORS.boardBg,
    borderTop: `6px solid ${COLORS.tileBg}`,
    flexShrink: 0,
  },
  podium: {
    flex: 1,
    background: COLORS.headerBg,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 8px',
    borderRight: `4px solid ${COLORS.boardBg}`,
    gap: 4,
  },
  name: {
    fontFamily: FONTS.heading,
    fontWeight: 600,
    fontSize: 'clamp(10px, 1.5vw, 20px)',
    color: COLORS.white,
    letterSpacing: 1,
    textAlign: 'center',
  },
  score: {
    fontFamily: FONTS.heading,
    fontWeight: 700,
    fontSize: 'clamp(12px, 2vw, 28px)',
    color: COLORS.gold,
  },
  negativeScore: {
    color: COLORS.negative,
  },
}
