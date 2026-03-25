import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'

export default defineConfig(() => {
  const gameFile = process.env.GAME_FILE
  let gameConfig = null

  if (gameFile) {
    try {
      const filePath = path.resolve(process.cwd(), gameFile)
      const contents = fs.readFileSync(filePath, 'utf8')
      gameConfig = yaml.load(contents)
      console.log(`✅ Loaded game: ${filePath}`)
    } catch (e) {
      console.error(`❌ Failed to load GAME_FILE: ${e.message}`)
      process.exit(1)
    }
  } else {
    console.warn('⚠️  No GAME_FILE specified. Run with: cross-env GAME_FILE=game.yaml npm run dev')
  }

  return {
    plugins: [react()],
    define: {
      __GAME_CONFIG__: JSON.stringify(gameConfig),
    },
  }
})
