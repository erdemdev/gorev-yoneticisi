import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.resolve(__dirname, '../../data')
const DB_PATH = path.join(DATA_DIR, 'db.json')

const EMPTY_DB = {
  employees: [],
  projects: [],
  tasks: [],
}

let writeQueue = Promise.resolve()

async function ensureDbFile() {
  await mkdir(DATA_DIR, { recursive: true })
  try {
    await readFile(DB_PATH, 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeFile(DB_PATH, JSON.stringify(EMPTY_DB, null, 2), 'utf8')
      return
    }
    throw error
  }
}

/**
 * @returns {Promise<{employees: object[], projects: object[], tasks: object[]}>}
 */
export async function readDb() {
  await ensureDbFile()
  const raw = await readFile(DB_PATH, 'utf8')
  try {
    const parsed = JSON.parse(raw)
    return {
      employees: Array.isArray(parsed.employees) ? parsed.employees : [],
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
    }
  } catch {
    return structuredClone(EMPTY_DB)
  }
}

/**
 * @param {{employees: object[], projects: object[], tasks: object[]}} db
 */
export async function writeDb(db) {
  await ensureDbFile()
  const payload = JSON.stringify(db, null, 2)
  writeQueue = writeQueue.then(() => writeFile(DB_PATH, payload, 'utf8'))
  await writeQueue
}

/**
 * Atomically read-modify-write the JSON database.
 * @template T
 * @param {(db: {employees: object[], projects: object[], tasks: object[]}) => T | Promise<T>} mutator
 * @returns {Promise<T>}
 */
export async function updateDb(mutator) {
  let result
  writeQueue = writeQueue.then(async () => {
    const db = await readDb()
    result = await mutator(db)
    await writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8')
  })
  await writeQueue
  return result
}
