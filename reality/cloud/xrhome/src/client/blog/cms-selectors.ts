import {useSelector} from '../hooks'

const useIsActionLoading = (actionToCheck: string) => (
  useSelector(state => state.cms.pending)
    .find(e => e.type === actionToCheck)
)

export {useIsActionLoading}
