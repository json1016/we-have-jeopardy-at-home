import { useState } from 'react'
import { COLORS, FONTS } from '../theme'

const MAX_PLAYERS = 6

export default function SetupScreen({ onStart }) {
  const [playerCount, setPlayerCount] = useState(3)
  const [names, setNames] = useState(Array(MAX_PLAYERS).fill(''))
  const [logoFailed, setLogoFailed] = useState(false)

  const updateName = (index, value) => {
    const updated = [...names]
    updated[index] = value
    setNames(updated)
  }

  const handleStart = () => {
    const playerNames = names
      .slice(0, playerCount)
      .map((name, i) => name.trim() || `Player ${i + 1}`)
    onStart(playerNames)
  }

  return (
    <div style={styles.container}>
      {logoFailed ? (
        <div style={styles.logoFallback}>JEOPARDY!</div>
      ) : (
        <img
          src="/jeopardy-logo.png"
          alt="Jeopardy!"
          style={{ width: 400 }}
          onError={() => setLogoFailed(true)}
        />
      )}

      <div style={styles.card}>
        <div style={styles.label}>Number of Players</div>
        <div style={styles.countRow}>
          {Array.from({ length: MAX_PLAYERS }, (_, i) => i + 1).map((count) => (
            <button
              key={count}
              style={{
                ...styles.countButton,
                ...(playerCount === count ? styles.countButtonActive : {}),
              }}
              onClick={() => setPlayerCount(count)}
            >
              {count}
            </button>
          ))}
        </div>

        <div style={styles.label}>Player Names</div>
        {Array.from({ length: playerCount }, (_, i) => (
          <input
            key={i}
            style={styles.input}
            placeholder={`Player ${i + 1}`}
            value={names[i]}
            onChange={(e) => updateName(i, e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          />
        ))}

        <button style={styles.startButton} onClick={handleStart}>
          START GAME
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    background: COLORS.background,
  },
  logoFallback: {
    fontFamily: FONTS.heading,
    fontWeight: 700,
    fontSize: 64,
    color: COLORS.gold,
    letterSpacing: 4,
  },
  card: {
    background: COLORS.headerBg,
    border: `3px solid ${COLORS.tileBg}`,
    borderRadius: 12,
    padding: '40px 48px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    minWidth: 400,
  },
  label: {
    color: COLORS.gold,
    fontFamily: FONTS.heading,
    fontWeight: 600,
    fontSize: 20,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  countRow: {
    display: 'flex',
    gap: 8,
  },
  countButton: {
    width: 48,
    height: 48,
    background: COLORS.tileBg,
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 700,
    borderRadius: 6,
    fontFamily: FONTS.heading,
    transition: 'all 0.15s',
  },
  countButtonActive: {
    background: COLORS.gold,
    color: COLORS.background,
  },
  input: {
    background: COLORS.inputBg,
    border: `2px solid ${COLORS.tileBg}`,
    borderRadius: 6,
    color: COLORS.white,
    fontSize: 20,
    fontFamily: FONTS.heading,
    fontWeight: 500,
    padding: '10px 16px',
    letterSpacing: 1,
  },
  startButton: {
    marginTop: 16,
    background: COLORS.gold,
    color: COLORS.background,
    fontSize: 24,
    fontWeight: 700,
    fontFamily: FONTS.heading,
    letterSpacing: 3,
    padding: '14px 0',
    borderRadius: 6,
    transition: 'all 0.15s',
  },
}
