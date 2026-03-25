import { useEffect, useCallback } from 'react'
import { gameReducer, initialState, PHASES } from './gameReducer'
import { COLORS, FONTS } from './theme'
import { playClueReveal, playDailyDouble } from './sounds'
import useUndoableReducer from './hooks/useUndoableReducer'
import SetupScreen from './components/SetupScreen'
import Board from './components/Board'
import ClueModal from './components/ClueModal'
import DailyDoubleWager from './components/DailyDoubleWager'
import FinalJeopardy from './components/FinalJeopardy'
import WinnerScreen from './components/WinnerScreen'
import Scoreboard from './components/Scoreboard'

export default function App() {
  const [state, rawDispatch, undo] = useUndoableReducer(gameReducer, initialState)
  const { phase, config, currentRound } = state

  const dispatch = useCallback((action) => {
    if (action.type === 'SELECT_CLUE') {
      const round = config?.rounds[currentRound]
      const clue = round?.categories[action.categoryIdx]?.clues[action.clueIdx]
      if (clue?.daily_double) {
        playDailyDouble()
      } else {
        playClueReveal()
      }
    }
    rawDispatch(action)
  }, [config, currentRound, rawDispatch])

  useEffect(() => {
    if (!config) {
      fetch('/api/config')
        .then((r) => r.ok ? r.json() : null)
        .then((data) => data && rawDispatch({ type: 'SET_CONFIG', config: data }))
        .catch(() => {})
    }
  }, [config, rawDispatch])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        undo()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo])

  if (!config) {
    return (
      <div style={styles.noConfigContainer}>
        <div style={styles.noConfigTitle}>JEOPARDY!</div>
        <div style={styles.noConfigSubtitle}>No game file loaded.</div>
        <div style={styles.noConfigCommand}>
          cross-env GAME_FILE=game.yaml npm run dev
        </div>
      </div>
    )
  }

  const showBoard =
    phase === PHASES.BOARD ||
    phase === PHASES.CLUE ||
    phase === PHASES.DAILY_DOUBLE_WAGER

  const showScoreboard = phase !== PHASES.SETUP && phase !== PHASES.WINNER

  const isFinalPhase =
    phase === PHASES.FINAL_CATEGORY ||
    phase === PHASES.FINAL_CLUE ||
    phase === PHASES.FINAL_REVEAL

  return (
    <div style={styles.root}>
      {phase === PHASES.SETUP && (
        <SetupScreen onStart={(players) => dispatch({ type: 'START_GAME', players })} />
      )}
      {showBoard && <Board state={state} dispatch={dispatch} />}
      {phase === PHASES.DAILY_DOUBLE_WAGER && (
        <DailyDoubleWager state={state} dispatch={dispatch} />
      )}
      {phase === PHASES.CLUE && <ClueModal state={state} dispatch={dispatch} />}
      {isFinalPhase && <FinalJeopardy state={state} dispatch={dispatch} />}
      {phase === PHASES.WINNER && <WinnerScreen state={state} />}
      {showScoreboard && <Scoreboard players={state.players} />}
    </div>
  )
}

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
  },
  noConfigContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    flexDirection: 'column',
    gap: 16,
  },
  noConfigTitle: {
    fontSize: 48,
    color: COLORS.gold,
    fontFamily: FONTS.heading,
    fontWeight: 700,
  },
  noConfigSubtitle: {
    color: '#aaa',
    fontSize: 20,
  },
  noConfigCommand: {
    color: '#666',
    fontSize: 16,
    fontFamily: 'monospace',
    background: '#111',
    padding: '12px 20px',
    borderRadius: 8,
  },
}
