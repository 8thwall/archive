// eslint-disable-next-line no-restricted-imports
import {connect as defaultConnect, Connect} from 'react-redux'

import type {RootState} from '../reducer'

const connect: Connect<RootState> = defaultConnect

export {
  connect,
}
