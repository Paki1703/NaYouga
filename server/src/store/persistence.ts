import { promises as fs } from 'fs'
import { dirname, join, resolve } from 'path'
import type { User, PromoCode, AdminLog } from '../types.js'

export interface PersistedState {
  version: number
  users: User[]
  promocodes: PromoCode[]
  adminLogs: AdminLog[]
  actionLogs: AdminLog[]
  processedPaymentIds: string[]
}

const CURRENT_VERSION = 1

function storePath(): string {
  const dir = process.env.DATA_DIR ? resolve(process.env.DATA_DIR) : resolve(process.cwd(), 'data')
  return join(dir, 'store.json')
}

export async function loadState(): Promise<PersistedState | null> {
  const file = storePath()
  try {
    const raw = await fs.readFile(file, 'utf-8')
    const data = JSON.parse(raw) as Partial<PersistedState>
    if (!data || typeof data !== 'object') return null
    return {
      version: data.version ?? CURRENT_VERSION,
      users: Array.isArray(data.users) ? data.users : [],
      promocodes: Array.isArray(data.promocodes) ? data.promocodes : [],
      adminLogs: Array.isArray(data.adminLogs) ? data.adminLogs : [],
      actionLogs: Array.isArray(data.actionLogs) ? data.actionLogs : [],
      processedPaymentIds: Array.isArray(data.processedPaymentIds) ? data.processedPaymentIds : [],
    }
  } catch (e) {
    const err = e as NodeJS.ErrnoException
    if (err.code !== 'ENOENT') {
      console.error('Failed to load persisted store (starting empty):', err.message)
    }
    return null
  }
}

let saveChain: Promise<void> = Promise.resolve()

export async function saveState(state: PersistedState): Promise<void> {
  const run = async () => {
    const file = storePath()
    const tmp = `${file}.tmp`
    try {
      await fs.mkdir(dirname(file), { recursive: true })
      await fs.writeFile(tmp, JSON.stringify(state, null, 2), 'utf-8')
      await fs.rename(tmp, file)
    } catch (e) {
      console.error('Failed to persist store:', (e as Error).message)
      await fs.unlink(tmp).catch(() => {})
    }
  }
  saveChain = saveChain.then(run, run)
  await saveChain
}
