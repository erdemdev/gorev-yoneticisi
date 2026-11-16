import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const seedPath = path.resolve(__dirname, '../../data/db.seed.json')
const dbPath = path.resolve(__dirname, '../../data/db.json')

async function seed() {
  const raw = await readFile(seedPath, 'utf8')
  JSON.parse(raw) // doğrula
  await writeFile(dbPath, raw, 'utf8')
  console.log(`Seed verisi yazıldı: ${dbPath}`)
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
