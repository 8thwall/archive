// @sublibrary(:dom-core-lib)
import type {Element} from './element'
import type {Attr} from './attr'

type AttributeChangedCallback = (
  element: Element,
  localName: string,
  oldValue: string | null,
  value: string | null,
  namespace: string | null,
) => void

// A map of Element to list of attributeChangedCallback.
const attributeChangeSteps: WeakMap<Element, AttributeChangedCallback[]> = new WeakMap()

// Add a new attribute change callback to the given element's attribute change steps.
const addAttributeChangeSteps = (element: Element, step: AttributeChangedCallback): void => {
  let steps = attributeChangeSteps.get(element)
  if (!steps) {
    steps = []
    attributeChangeSteps.set(element, steps)
  }
  steps.push(step)
}

// Run the attribute change steps for a given element.
const runAttributeChangeSteps = (
  element: Element,
  localName: string,
  oldValue: string | null,
  value: string | null,
  namespace: string | null
): void => {
  const steps = attributeChangeSteps.get(element) ?? []
  steps.forEach(step => step(element, localName, oldValue, value, namespace))
}

// To handle attribute changes for an attribute attribute with element, oldValue, and newValue, run
// these steps:
// See: https://dom.spec.whatwg.org/#handle-attribute-changes
const handleAttributeChanges = (
  attribute: Attr, element: Element, oldValue: string | null, newValue: string | null
): void => {
  // 1. Queue a mutation record of "attributes" for element with attribute’s local name, attribute’s
  // namespace, oldValue, « », « », null, and null.
  // [NOT IMPLEMENTED]

  // 2. If element is custom, then enqueue a custom element callback reaction with element, callback
  // name "attributeChangedCallback", and an argument list containing attribute’s local name,
  // oldValue, newValue, and attribute’s namespace.
  // [NOT IMPLEMENTED]

  // Run the attribute change steps with element, attribute’s local name, oldValue, newValue, and
  // attribute’s namespace.
  runAttributeChangeSteps(element, attribute.localName, oldValue, newValue, attribute.namespaceURI)
}

export {
  AttributeChangedCallback,
  attributeChangeSteps,
  addAttributeChangeSteps,
  handleAttributeChanges,
  runAttributeChangeSteps,
}
