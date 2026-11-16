import { createApp } from './app.js'

const PORT = Number(process.env.PORT) || 3000
const app = createApp()

app.listen(PORT, () => {
  console.log(`Görev Yöneticisi API http://localhost:${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
})
