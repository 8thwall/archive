import {createRegistry} from './registry'
import {loadRuntimeInfo} from './info'

const info = loadRuntimeInfo()

const Modules8 = createRegistry(info)
Object.assign(window, {Modules8})
