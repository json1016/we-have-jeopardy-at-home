import { useReducer, useCallback, useEffect } from 'react'

const UNDO_ACTION = '__UNDO__'
const STORAGE_KEY = 'jeopardy_history'

function loadSavedHistory(initialState) {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {}
  return [initialState]
}

export default function useUndoableReducer(reducer, initialState) {
  const [history, pushHistory] = useReducer((hist, action) => {
    if (action.type === UNDO_ACTION) {
      return hist.length > 1 ? hist.slice(0, -1) : hist
    }
    const current = hist[hist.length - 1]
    const next = reducer(current, action)
    return [...hist, next]
  }, initialState, () => loadSavedHistory(initialState))

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    } catch {}
  }, [history])

  const state = history[history.length - 1]
  const dispatch = useCallback((action) => pushHistory(action), [])
  const undo = useCallback(() => pushHistory({ type: UNDO_ACTION }), [])

  return [state, dispatch, undo]
}
