import {useSelector} from '../hooks'

const getKey = (appUuid, branch, path) => `${appUuid}-${branch}-${path}`

const useFileContent = (appUuid, branch, path) => (
  useSelector(state => state.publicBrowse.contentByPath[getKey(appUuid, branch, path)])
)

export {
  getKey,
  useFileContent,
}
