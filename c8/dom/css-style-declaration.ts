// @sublibrary(:dom-core-lib)

type CSSProperty = { value: string; important: boolean }

const propMap = new WeakMap<CSSStyleDeclaration, Map<string, CSSProperty>>()

const props = (styleDeclaration: CSSStyleDeclaration) => propMap.get(styleDeclaration)!

interface CSSRule {}
class CSSStyleDeclaration {
  /* eslint-disable no-undef */
  [key: string]: any,

  [index: number]: string
  /* eslint-enable no-undef */

  constructor() {
    const proxy = new Proxy(this, {
      get: (target, property) => {
        if (typeof property === 'string') {
          if (!Number.isNaN(Number(property))) {
            return target.item(Number(property))
          }
          if (property in target) {
            return (target as any)[property]
          }
          return target.getPropertyValue(property)
        }
        if (typeof property === 'symbol') {
          const value = Reflect.get(target, property)
          return typeof value === 'function' ? value.bind(target) : value
        }
        return undefined
      },
      set: (target, property, value) => {
        if (typeof property === 'string') {
          if (property in target) {
            (target as any)[property] = value
          } else {
            target.setProperty(property, value)
          }
          return true
        }
        return false
      },
      ownKeys: (target) => {
        const {length} = target
        return Array.from({length}, (_, i) => String(i))
      },
      getOwnPropertyDescriptor: (target, property) => {
        if (typeof property === 'string' && !Number.isNaN(Number(property))) {
          return {
            value: target.item(Number(property)),
            enumerable: true,
            configurable: true,
          }
        }
        return undefined
      },
    })
    propMap.set(this, new Map<string, CSSProperty>())
    propMap.set(proxy, propMap.get(this)!)
    return proxy
  }

  // Get the value of a CSS property
  // See: https://www.w3.org/TR/cssom-1/#dom-cssstyledeclaration-getpropertyvalue
  getPropertyValue(property: string): string {
    return props(this).get(property)?.value || ''
  }

  // Set the value of a CSS property
  // See: https://www.w3.org/TR/cssom-1/#dom-cssstyledeclaration-setproperty
  setProperty(property: string, value: string, priority: string = ''): void {
    if (value === undefined) {
      return
    }
    if (value === null || value === '') {
      this.removeProperty(property)
      return
    }
    const castValue = String(value)
    // Parse will fail if the value contains '!important'
    // See: https://www.w3.org/TR/cssom-1/#parse-a-css-value
    if (castValue.match(/(.*)!(important)$/)) {
      return
    }
    const importantBool = priority.trim().toLowerCase() === 'important'
    props(this).set(property, {value: castValue, important: importantBool})
  }

  // Remove a CSS property
  // See: https://www.w3.org/TR/cssom-1/#dom-cssstyledeclaration-removeproperty
  removeProperty(property: string): string {
    const value = this.getPropertyValue(property)
    props(this).delete(property)
    return value
  }

  // Get the priority of a CSS property
  // See: https://www.w3.org/TR/cssom-1/#dom-cssstyledeclaration-getpropertypriority
  getPropertyPriority(property: string): string {
    return props(this).get(property)?.important ? 'important' : ''
  }

  // Get the CSS text for all properties
  // See: https://www.w3.org/TR/cssom-1/#dom-cssstyledeclaration-csstext
  get cssText(): string {
    return Array.from(props(this).entries())
      .map(([prop, {value, important}]) => `${prop}: ${value}${important ? ' !important' : ''};`)
      .join(' ')
  }

  // Set the CSS text for all properties
  // See: https://www.w3.org/TR/cssom-1/#dom-cssstyledeclaration-csstext
  set cssText(cssText: string) {
    props(this).clear()
    cssText.split(';')
      .map(declaration => declaration.trim())
      .filter(Boolean)
      .forEach((declaration) => {
        const [property, value] = declaration.split(':').map(str => str.trim())
        const match = value.match(/(.*)!(important)$/)
        if (match) {
          this.setProperty(property, match[1].trim(), 'important')
        } else {
          this.setProperty(property, value)
        }
      })
  }

  // Get the number of properties in the style declaration
  // See: https://www.w3.org/TR/cssom-1/#dom-cssstyledeclaration-length
  get length(): number {
    return props(this).size
  }

  // Get the name of a CSS property at a given index
  // See: https://www.w3.org/TR/cssom-1/#dom-cssstyledeclaration-item
  item(index: number): string {
    const itemIndex = parseInt(index.toString(), 10)
    return Array.from(props(this).keys())[itemIndex] || ''
  }

  // Get the parent CSS rule
  // See: https://www.w3.org/TR/cssom-1/#dom-cssstyledeclaration-parentrule
  // eslint-disable-next-line class-methods-use-this
  get parentRule(): CSSRule | null {
    return null
  }

  [Symbol.iterator]() {
    return props(this).keys()
  }

  [Symbol.toStringTag] = 'CSSStyleDeclaration'
}

export {CSSStyleDeclaration}
