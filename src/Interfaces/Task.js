/**
 * @typedef {'pending' | 'in-progress' | 'done'} TaskStatus
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {TaskStatus} status
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export const TASK_STATUSES = [
  { value: 'pending', label: 'Bekliyor' },
  { value: 'in-progress', label: 'Devam ediyor' },
  { value: 'done', label: 'Tamamlandı' },
]

/**
 * @param {Partial<Task>} data
 * @returns {Task}
 */
export function createTask(data) {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    title: data.title?.trim() || '',
    description: data.description?.trim() || '',
    status: data.status || 'pending',
    createdAt: now,
    updatedAt: now,
  }
}
