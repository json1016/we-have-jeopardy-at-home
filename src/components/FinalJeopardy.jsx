import { useState } from 'react'
import { PHASES } from '../gameReducer'
import { COLORS, FONTS } from '../theme'
import { formatScore } from '../utils'

export default function FinalJeopardy({ state, dispatch }) {
  const { phase, config, players, finalRevealIndex, finalRevealOrder, finalDeltas } = state
  const finalJeopardy = config.final_jeopardy
  const [wagerInput, setWagerInput] = useState('')

  if (phase === PHASES.FINAL_CATEGORY) {
    return (
      <div style={styles.screen}>
        <div style={styles.bigCategory}>{finalJeopardy.category.toUpperCase()}</div>
        <button style={styles.button} onClick={() => dispatch({ type: 'REVEAL_FINAL_CLUE' })}>
          REVEAL CLUE
        </button>
      </div>
    )
  }

  if (phase === PHASES.FINAL_CLUE) {
    return (
      <div style={styles.screen}>
        <div style={styles.clueText}>{finalJeopardy.prompt.toUpperCase()}</div>
        <button style={styles.button} onClick={() => dispatch({ type: 'START_FINAL_REVEAL' })}>
          BEGIN REVEALS
        </button>
      </div>
    )
  }

  if (phase === PHASES.FINAL_REVEAL) {
    const currentPlayerIndex = finalRevealOrder[finalRevealIndex]
    const currentPlayer = players[currentPlayerIndex]

    const submitResult = (correct) => {
      const amount = parseInt(wagerInput, 10)
      if (isNaN(amount) || amount < 0) return
      dispatch({ type: 'SUBMIT_FINAL_RESULT', delta: correct ? amount : -amount })
      setWagerInput('')
    }

    return (
      <div style={styles.screen}>
        <div style={styles.label}>FINAL JEOPARDY — REVEALS</div>

        <div style={styles.revealedRow}>
          {finalRevealOrder.map((playerIdx, revealIdx) => {
            const player = players[playerIdx]
            const isRevealed = revealIdx < finalRevealIndex
            const delta = finalDeltas[playerIdx]

            return (
              <div
                key={player.name}
                style={{ ...styles.card, ...(isRevealed ? styles.cardRevealed : {}) }}
              >
                <div style={styles.cardName}>{player.name}</div>
                {isRevealed && delta != null && (
                  <>
                    <div
                      style={{
                        ...styles.cardDelta,
                        color: delta >= 0 ? '#00CC44' : COLORS.negative,
                      }}
                    >
                      {delta >= 0 ? `+${formatScore(delta)}` : formatScore(delta)}
                    </div>
                    <div
                      style={{
                        ...styles.cardScore,
                        ...(player.score < 0 ? { color: COLORS.negative } : {}),
                      }}
                    >
                      {formatScore(player.score)}
                    </div>
                  </>
                )}
                {!isRevealed && <div style={styles.cardHidden}>?</div>}
              </div>
            )
          })}
        </div>

        <div style={styles.inputSection}>
          <div style={styles.currentLabel}>
            Revealing: <strong>{currentPlayer.name}</strong>
          </div>
          <div style={styles.currentScore}>
            Current score: {formatScore(currentPlayer.score)}
          </div>
          <input
            style={styles.input}
            type="number"
            value={wagerInput}
            onChange={(e) => setWagerInput(e.target.value)}
            placeholder="Wager amount"
            autoFocus
            min={0}
          />
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              style={{ ...styles.button, background: COLORS.correct }}
              onClick={() => submitResult(true)}
            >
              ✓ CORRECT
            </button>
            <button
              style={{ ...styles.button, background: COLORS.wrong }}
              onClick={() => submitResult(false)}
            >
              ✗ WRONG
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

const styles = {
  screen: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    background: COLORS.background,
    padding: 24,
  },
  label: {
    fontFamily: FONTS.heading,
    fontWeight: 600,
    fontSize: 28,
    color: COLORS.gold,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  bigCategory: {
    fontFamily: FONTS.heading,
    fontWeight: 700,
    fontSize: 'clamp(50px, 6vw, 90px)',
    color: COLORS.white,
    textAlign: 'center',
    textShadow: '3px 3px 0 rgba(0,0,0,0.5)',
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
  button: {
    background: COLORS.gold,
    color: COLORS.background,
    fontFamily: FONTS.heading,
    fontWeight: 700,
    fontSize: 22,
    letterSpacing: 3,
    padding: '12px 36px',
    borderRadius: 6,
    marginTop: 8,
  },
  revealedRow: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    background: COLORS.tileBg,
    border: `3px solid ${COLORS.gold}`,
    borderRadius: 10,
    padding: '16px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    minWidth: 140,
  },
  cardRevealed: {
    background: COLORS.headerBg,
  },
  cardName: {
    fontFamily: FONTS.heading,
    fontWeight: 600,
    fontSize: 20,
    color: COLORS.white,
  },
  cardHidden: {
    fontFamily: FONTS.heading,
    fontWeight: 700,
    fontSize: 36,
    color: 'rgba(255,255,255,0.2)',
  },
  cardDelta: {
    fontFamily: FONTS.heading,
    fontWeight: 600,
    fontSize: 20,
  },
  cardScore: {
    fontFamily: FONTS.heading,
    fontWeight: 700,
    fontSize: 24,
    color: COLORS.gold,
  },
  inputSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  currentLabel: {
    fontFamily: FONTS.heading,
    fontWeight: 600,
    fontSize: 24,
    color: COLORS.white,
    letterSpacing: 1,
  },
  currentScore: {
    fontFamily: FONTS.heading,
    fontWeight: 600,
    fontSize: 18,
    color: COLORS.gold,
  },
  input: {
    background: COLORS.inputBg,
    border: `2px solid ${COLORS.gold}`,
    borderRadius: 6,
    color: COLORS.gold,
    fontSize: 28,
    fontFamily: FONTS.heading,
    fontWeight: 700,
    padding: '10px 20px',
    textAlign: 'center',
    width: 260,
  },
}
