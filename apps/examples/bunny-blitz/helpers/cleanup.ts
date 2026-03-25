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
  // eslint-disable-next-line no-unused-expressions
  cleanups(component.schemaAttribute).get(component.eid)?.()
  cleanups(component.schemaAttribute).delete(component.eid)
}

export {
  addCleanup,
  doCleanup,
}
