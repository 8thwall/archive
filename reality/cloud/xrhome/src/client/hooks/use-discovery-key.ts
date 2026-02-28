import {useParams} from 'react-router-dom'

import {useSelector} from '../hooks'
import {ALL_KEYWORD} from '../../shared/discovery-constants'

type DiscoveryKeyParams = {
  keyword?: string
}

const useDiscoveryKey = () => {
  const params = useParams<DiscoveryKeyParams>()
  const keywords = useSelector(state => state.discovery.keywords)
  const key = keywords.find(k => params.keyword === (k.slug || k.name))
  return (
    typeof key === 'undefined' ? ALL_KEYWORD : key
  )
}

export {useDiscoveryKey}
