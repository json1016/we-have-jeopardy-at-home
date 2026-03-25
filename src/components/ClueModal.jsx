import { COLORS, FONTS } from '../theme'

export default function ClueModal({ state, dispatch }) {
  const { activeClue, players, wrongThisClue, dailyDoublePlayer } = state

  const eligiblePlayers = activeClue.isDailyDouble
    ? [{ ...players[dailyDoublePlayer], index: dailyDoublePlayer }]
    : players.map((player, i) => ({ ...player, index: i }))

  return (
    <div style={styles.overlay}>
      <div style={styles.clueText}>{activeClue.prompt.toUpperCase()}</div>

      <div style={styles.scoringBar}>
        {eligiblePlayers.map(({ name, index }) => {
          const alreadyWrong = wrongThisClue.includes(index)
          return (
            <div key={index} style={styles.playerGroup}>
              <button
                style={{
                  ...styles.actionButton,
                  background: COLORS.correct,
                  ...(alreadyWrong ? styles.buttonDisabled : {}),
                }}
                disabled={alreadyWrong}
                onClick={() => dispatch({ type: 'AWARD_CORRECT', playerIndex: index })}
              >
                ✓
              </button>
              <span
                style={{
                  ...styles.playerName,
                  ...(alreadyWrong ? styles.playerNameWrong : {}),
                }}
              >
                {name}
              </span>
              <button
                style={{
                  ...styles.actionButton,
                  background: COLORS.wrong,
                  ...(alreadyWrong ? styles.buttonDisabled : {}),
                }}
                disabled={alreadyWrong}
                onClick={() => dispatch({ type: 'AWARD_WRONG', playerIndex: index })}
              >
                ✗
              </button>
            </div>
          )
        })}
        <button style={styles.skipButton} onClick={() => dispatch({ type: 'CLOSE_CLUE' })}>
          SKIP
        </button>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: COLORS.tileBg,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '40px 60px 0',
  },
  clueText: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: FONTS.display,
    fontWeight: 700,
    fontSize: 'clamp(28px, 5.5vw, 72px)',
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 1.4,
    textShadow: '3px 3px 6px rgba(0,0,0,0.6)',
  },
  scoringBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    padding: '16px 24px',
    background: COLORS.overlay,
    width: '100%',
    flexWrap: 'wrap',
  },
  playerGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  playerName: {
    fontFamily: FONTS.heading,
    fontWeight: 600,
    fontSize: 22,
    color: COLORS.white,
    letterSpacing: 1,
    minWidth: 60,
    textAlign: 'center',
  },
  playerNameWrong: {
    color: COLORS.muted,
    textDecoration: 'line-through',
  },
  actionButton: {
    color: COLORS.white,
    fontFamily: FONTS.heading,
    fontWeight: 700,
    fontSize: 18,
    width: 36,
    height: 36,
    borderRadius: 4,
  },
  buttonDisabled: {
    opacity: 0.3,
    cursor: 'not-allowed',
  },
  skipButton: {
    background: 'transparent',
    color: COLORS.muted,
    fontFamily: FONTS.heading,
    fontWeight: 600,
    fontSize: 14,
    letterSpacing: 2,
    padding: '8px 16px',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 4,
    marginLeft: 16,
  },
}
