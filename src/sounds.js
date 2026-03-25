const clueSound = new Audio('/ding.mp3')
const dailyDoubleSound = new Audio('/daily-double-jeopardy.mp3')

export function playClueReveal() {
  clueSound.currentTime = 0
  clueSound.play()
}

export function playDailyDouble() {
  dailyDoubleSound.currentTime = 0
  dailyDoubleSound.play()
}
