import { useState } from 'react'
import { getMaxBoardValue } from '../gameReducer'
import { COLORS, FONTS } from '../theme'
import { formatScore } from '../utils'

export default function DailyDoubleWager({ state, dispatch }) {
  const { activeClue, currentRound, config, players } = state
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [wager, setWager] = useState('')

  const round = config.rounds[currentRound]
  const clueCount = round.categories[0]?.clues?.length ?? 5
  const maxBoardValue = getMaxBoardValue(currentRound, clueCount)

  const MIN_WAGER = 5
  const maxWager =
    selectedPlayer !== null
      ? Math.max(players[selectedPlayer].score, maxBoardValue)
      : null

  const handleSubmit = () => {
    if (selectedPlayer === null) return
    const amount = parseInt(wager, 10)
    if (isNaN(amount) || amount < MIN_WAGER || amount > maxWager) return
    dispatch({ type: 'SUBMIT_DAILY_DOUBLE_WAGER', wager: amount, playerIndex: selectedPlayer })
  }

  const categoryName = round.categories[activeClue.categoryIdx].name.toUpperCase()

  return (
    <div style={styles.overlay}>
      <div style={styles.inner}>
        <div style={styles.title}>DAILY DOUBLE</div>
        <div style={styles.subtitle}>{categoryName}</div>

        <div style={styles.label}>Which player?</div>
        <div style={styles.playerRow}>
          {players.map((player, index) => (
            <button
              key={player.name}
              style={{
                ...styles.playerButton,
                ...(selectedPlayer === index ? styles.playerButtonActive : {}),
              }}
              onClick={() => {
                setSelectedPlayer(index)
                setWager('')
              }}
            >
              {player.name}
              <span style={styles.playerScore}>{formatScore(player.score)}</span>
            </button>
          ))}
        </div>

        {selectedPlayer !== null && (
          <>
            <div style={styles.label}>Enter Wager</div>
            <div style={styles.wagerRange}>
              $5 minimum — ${maxWager.toLocaleString()} maximum
            </div>
            <input
              style={styles.input}
              type="number"
              value={wager}
              onChange={(e) => setWager(e.target.value)}
              placeholder="0"
              min={MIN_WAGER}
              max={maxWager}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              autoFocus
            />
            <button style={styles.submitButton} onClick={handleSubmit}>
              REVEAL CLUE
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: COLORS.headerBg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    padding: 24,
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    maxWidth: 600,
    width: '100%',
  },
  title: {
    fontFamily: FONTS.heading,
    fontWeight: 700,
    fontSize: 'clamp(48px, 10vw, 120px)',
    color: COLORS.gold,
    letterSpacing: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.heading,
    fontWeight: 600,
    fontSize: 24,
    color: COLORS.white,
    letterSpacing: 2,
  },
  label: {
    fontFamily: FONTS.heading,
    fontWeight: 600,
    fontSize: 20,
    color: COLORS.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  playerRow: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  playerButton: {
    background: COLORS.tileBg,
    color: COLORS.white,
    fontFamily: FONTS.heading,
    fontWeight: 600,
    fontSize: 20,
    padding: '12px 20px',
    borderRadius: 6,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  playerButtonActive: {
    background: COLORS.gold,
    color: COLORS.background,
  },
  playerScore: {
    fontSize: 14,
    fontWeight: 500,
    opacity: 0.8,
  },
  wagerRange: {
    fontFamily: FONTS.heading,
    fontWeight: 500,
    fontSize: 18,
    color: COLORS.white,
    letterSpacing: 1,
    opacity: 0.7,
  },
  input: {
    background: COLORS.inputBg,
    border: `2px solid ${COLORS.gold}`,
    borderRadius: 6,
    color: COLORS.gold,
    fontSize: 32,
    fontFamily: FONTS.heading,
    fontWeight: 700,
    padding: '12px 20px',
    textAlign: 'center',
    width: 280,
  },
  submitButton: {
    background: COLORS.gold,
    color: COLORS.background,
    fontFamily: FONTS.heading,
    fontWeight: 700,
    fontSize: 24,
    letterSpacing: 3,
    padding: '14px 40px',
    borderRadius: 6,
  },
}
