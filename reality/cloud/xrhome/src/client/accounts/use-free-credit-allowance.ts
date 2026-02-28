import {useDispatch} from 'react-redux'
import {useQuery} from '@tanstack/react-query'

import authenticatedFetch from '../common/authenticated-fetch'
import {MILLISECONDS_PER_HOUR} from '../../shared/time-utils'

const useFreeCreditAllowance = (accountUuid: string | undefined) => {
  const dispatch = useDispatch()
  useQuery({
    queryKey: ['credits', 'free-grants', accountUuid],
    staleTime: MILLISECONDS_PER_HOUR,
    queryFn: () => (
      accountUuid
        ? dispatch(authenticatedFetch(`/v1/credits/${accountUuid}/free-grants`, {
          method: 'POST',
        }))
        : null
    ),
  })
}

export {
  useFreeCreditAllowance,
}
