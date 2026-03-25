import * as ecs from '@8thwall/ecs'
import {createInstanced} from './instanced'

type Cleanup = () => void
const cleanups = createInstanced<object, Map<BigInt, Cleanup>>(() => new Map())

type ComponentCursor = {
  eid: BigInt
  schemaAttribute: object
}

const addCleanup = (component: ComponentCursor, cleanup: Cleanup) => (
  cleanups(component.schemaAttribute).set(component.eid, cleanup)
)

const doCleanup = (component: ComponentCursor) => {
  cleanups(component.schemaAttribute).get(component.eid)?.()  // eslint-disable-line no-unused-expressions
  cleanups(component.schemaAttribute).delete(component.eid)
}

export {
  addCleanup,
  doCleanup,
}
