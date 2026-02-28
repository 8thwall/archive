import {useMemo} from 'react'
import uuidv4 from 'uuid/v4'

const useUuid = () => useMemo(() => uuidv4(), [])

export {
  useUuid,
}
