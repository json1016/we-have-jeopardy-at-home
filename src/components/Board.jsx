import { getClueValue } from '../gameReducer'
import { COLORS, FONTS } from '../theme'

export default function Board({ state, dispatch }) {
  const { config, currentRound, revealed } = state
  const round = config.rounds[currentRound]
  const categories = round.categories
  const columnCount = categories.length
  const rowCount = categories[0]?.clues?.length ?? 5

  const isRevealed = (colIdx, rowIdx) => !!revealed[`${colIdx}-${rowIdx}`]

  const handleTileClick = (categoryIndex, clueIndex) => {
    if (isRevealed(categoryIndex, clueIndex)) return
    dispatch({ type: 'SELECT_CLUE', categoryIdx: categoryIndex, clueIdx: clueIndex })
  }

  return (
    <div style={{ ...styles.board, gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}>
      {categories.map((category, colIdx) => (
        <div key={category.name} style={styles.categoryHeader}>
          <span style={styles.categoryText}>{category.name.toUpperCase()}</span>
        </div>
      ))}

      {Array.from({ length: rowCount }, (_, rowIdx) =>
        categories.map((_, colIdx) => {
          const done = isRevealed(colIdx, rowIdx)
          const value = getClueValue(currentRound, rowIdx)
          return (
            <div
              key={`${colIdx}-${rowIdx}`}
              style={{
                ...styles.tile,
                ...(done ? styles.tileRevealed : styles.tileActive),
              }}
              onClick={() => handleTileClick(colIdx, rowIdx)}
            >
              {!done && (
                <span style={styles.dollarValue}>${value.toLocaleString()}</span>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}

const styles = {
  board: {
    flex: 1,
    display: 'grid',
    gap: '6px',
    padding: '6px',
    background: COLORS.boardBg,
    overflow: 'hidden',
  },
  categoryHeader: {
    background: COLORS.headerBg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 12px',
    textAlign: 'center',
  },
  categoryText: {
    fontFamily: FONTS.heading,
    fontWeight: 600,
    fontSize: 'clamp(12px, 2vw, 28px)',
    color: COLORS.white,
    lineHeight: 1.2,
  },
  tile: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'filter 0.1s',
    userSelect: 'none',
  },
  tileActive: { background: COLORS.tileBg },
  tileRevealed: { background: COLORS.tileRevealed, cursor: 'default' },
  dollarValue: {
    fontFamily: FONTS.heading,
    fontWeight: 700,
    fontSize: 'clamp(16px, 3vw, 52px)',
    color: COLORS.gold,
    textShadow: '3px 3px 6px rgba(0,0,0,0.6)',
  },
}
