import type {Project} from '../../shared/studiohub/local-sync-types'
import {getDb} from './application-state'

const upsertLocalProject = (
  appKey: string, location: string, initialization?: 'needs-initialization' | 'done'
) => {
  const db = getDb()
  db.prepare('INSERT OR REPLACE INTO projects (appKey, location, initialization) VALUES (?, ?, ?)')
    .run(appKey, location, initialization || 'needs-initialization')
}

const deleteLocalProject = (appKey: string) => {
  const db = getDb()
  db.prepare('DELETE FROM projects WHERE appKey = ?').run(appKey)
}

const getLocalProject = (appKey: string): Project | undefined => {
  const db = getDb()
  return db.prepare<[string], Project>('SELECT * FROM projects WHERE appKey = ?').get(appKey)
}

const markLocalProjectInitialized = (appKey: string) => {
  const db = getDb()
  db.prepare('UPDATE projects SET initialization = ? WHERE appKey = ?').run('done', appKey)
}

const getLocalProjects = (): Project[] => {
  const db = getDb()
  return db.prepare<[], Project>('SELECT * FROM projects').all()
}

export {
  upsertLocalProject,
  deleteLocalProject,
  getLocalProject,
  markLocalProjectInitialized,
  getLocalProjects,
}
