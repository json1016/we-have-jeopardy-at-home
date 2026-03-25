export const PHASES = {
  SETUP: 'setup',
  BOARD: 'board',
  CLUE: 'clue',
  DAILY_DOUBLE_WAGER: 'daily_double_wager',
  FINAL_CATEGORY: 'final_category',
  FINAL_CLUE: 'final_clue',
  FINAL_REVEAL: 'final_reveal',
  WINNER: 'winner',
}

const VALUE_INCREMENT = 200

export function getClueValue(roundIndex, clueIndex) {
  return VALUE_INCREMENT * (roundIndex + 1) * (clueIndex + 1)
}

export function getMaxBoardValue(roundIndex, clueCount) {
  return getClueValue(roundIndex, clueCount - 1)
}

function revealedKey(categoryIndex, clueIndex) {
  return `${categoryIndex}-${clueIndex}`
}

function isRoundComplete(revealed, round) {
  return round.categories.every((category, catIdx) =>
    category.clues.every((_, clueIdx) => revealed[revealedKey(catIdx, clueIdx)])
  )
}

function markClueRevealed(state) {
  const { categoryIdx, clueIdx } = state.activeClue
  return { ...state.revealed, [revealedKey(categoryIdx, clueIdx)]: true }
}

function updatePlayerScore(players, playerIndex, delta) {
  return players.map((player, i) =>
    i === playerIndex ? { ...player, score: player.score + delta } : player
  )
}

function returnToBoard(state) {
  return {
    ...state,
    phase: PHASES.BOARD,
    activeClue: null,
    wrongThisClue: [],
    dailyDoubleWager: null,
    dailyDoublePlayer: null,
  }
}

function advanceAfterClue(state) {
  const { config, currentRound } = state
  const round = config.rounds[currentRound]
  const boardState = returnToBoard(state)

  if (!isRoundComplete(state.revealed, round)) {
    return boardState
  }

  if (currentRound + 1 < config.rounds.length) {
    return { ...boardState, currentRound: currentRound + 1, revealed: {} }
  }

  if (config.final_jeopardy) {
    return { ...boardState, phase: PHASES.FINAL_CATEGORY }
  }

  return { ...boardState, phase: PHASES.WINNER }
}

function handleSelectClue(state, { categoryIdx, clueIdx }) {
  const round = state.config.rounds[state.currentRound]
  const clue = round.categories[categoryIdx].clues[clueIdx]
  const value = getClueValue(state.currentRound, clueIdx)
  const isDailyDouble = !!clue.daily_double

  const activeClue = { categoryIdx, clueIdx, value, prompt: clue.prompt, isDailyDouble }
  const phase = isDailyDouble ? PHASES.DAILY_DOUBLE_WAGER : PHASES.CLUE

  return { ...state, phase, activeClue, wrongThisClue: [] }
}

function handleAwardCorrect(state, { playerIndex }) {
  if (state.wrongThisClue.includes(playerIndex)) return state

  const value = state.activeClue.isDailyDouble
    ? state.dailyDoubleWager
    : state.activeClue.value

  const players = updatePlayerScore(state.players, playerIndex, value)
  const revealed = markClueRevealed(state)

  return advanceAfterClue({ ...state, players, revealed })
}

function handleAwardWrong(state, { playerIndex }) {
  if (state.wrongThisClue.includes(playerIndex)) return state

  const value = state.activeClue.isDailyDouble
    ? state.dailyDoubleWager
    : state.activeClue.value

  const players = updatePlayerScore(state.players, playerIndex, -value)
  const wrongThisClue = [...state.wrongThisClue, playerIndex]

  if (state.activeClue.isDailyDouble) {
    const revealed = markClueRevealed(state)
    return advanceAfterClue({ ...state, players, revealed })
  }

  return { ...state, players, wrongThisClue }
}

function handleStartFinalReveal(state) {
  const order = state.players
    .map((_, i) => i)
    .sort((a, b) => state.players[a].score - state.players[b].score)

  return {
    ...state,
    phase: PHASES.FINAL_REVEAL,
    finalRevealIndex: 0,
    finalRevealOrder: order,
    finalDeltas: new Array(state.players.length).fill(null),
  }
}

function handleSubmitFinalResult(state, { delta }) {
  const playerIndex = state.finalRevealOrder[state.finalRevealIndex]
  const players = updatePlayerScore(state.players, playerIndex, delta)

  const finalDeltas = [...state.finalDeltas]
  finalDeltas[playerIndex] = delta

  const isLastPlayer = state.finalRevealIndex + 1 >= state.players.length

  return {
    ...state,
    players,
    finalDeltas,
    finalRevealIndex: isLastPlayer ? state.finalRevealIndex : state.finalRevealIndex + 1,
    phase: isLastPlayer ? PHASES.WINNER : PHASES.FINAL_REVEAL,
  }
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_CONFIG':
      return { ...state, config: action.config }

    case 'START_GAME': {
      const players = action.players.map((name) => ({ name, score: 0 }))
      return {
        ...state,
        phase: PHASES.BOARD,
        players,
        currentRound: 0,
        revealed: {},
        activeClue: null,
        wrongThisClue: [],
        dailyDoubleWager: null,
        dailyDoublePlayer: null,
        finalRevealIndex: 0,
        finalRevealOrder: [],
        finalDeltas: [],
      }
    }

    case 'SELECT_CLUE':
      return handleSelectClue(state, action)

    case 'SUBMIT_DAILY_DOUBLE_WAGER':
      return {
        ...state,
        phase: PHASES.CLUE,
        dailyDoubleWager: action.wager,
        dailyDoublePlayer: action.playerIndex,
      }

    case 'AWARD_CORRECT':
      return handleAwardCorrect(state, action)

    case 'AWARD_WRONG':
      return handleAwardWrong(state, action)

    case 'CLOSE_CLUE':
      return advanceAfterClue({ ...state, revealed: markClueRevealed(state) })

    case 'REVEAL_FINAL_CLUE':
      return { ...state, phase: PHASES.FINAL_CLUE }

    case 'START_FINAL_REVEAL':
      return handleStartFinalReveal(state)

    case 'SUBMIT_FINAL_RESULT':
      return handleSubmitFinalResult(state, action)

    default:
      return state
  }
}

export const initialState = {
  phase: PHASES.SETUP,
  config: typeof __GAME_CONFIG__ !== 'undefined' ? __GAME_CONFIG__ : null,
  players: [],
  currentRound: 0,
  revealed: {},
  activeClue: null,
  dailyDoubleWager: null,
  dailyDoublePlayer: null,
  wrongThisClue: [],
  finalRevealIndex: 0,
  finalRevealOrder: [],
  finalDeltas: [],
}
