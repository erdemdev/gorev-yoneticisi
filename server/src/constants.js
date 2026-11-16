/** @typedef {'pending' | 'in-progress' | 'done'} TaskStatus */
/** @typedef {'low' | 'medium' | 'high' | 'critical'} TaskPriority */
/** @typedef {'planning' | 'active' | 'on-hold' | 'completed'} ProjectStatus */

export const TASK_STATUSES = ['pending', 'in-progress', 'done']
export const TASK_PRIORITIES = ['low', 'medium', 'high', 'critical']
export const PROJECT_STATUSES = ['planning', 'active', 'on-hold', 'completed']

export const PRIORITY_ORDER = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}
