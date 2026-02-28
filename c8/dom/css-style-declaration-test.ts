// @package(npm-rendering)
// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)
import {assert, beforeEach, describe, it} from '@nia/bzl/js/chai-js'
import {CSSStyleDeclaration} from '@nia/c8/dom/css-style-declaration'

describe('CSSStyleDeclaration', () => {
  let style: CSSStyleDeclaration

  beforeEach(() => {
    style = new CSSStyleDeclaration()
  })

  it('should have expected properties', () => {
    assert.isNumber(style.length)
    assert.isFunction(style.getPropertyValue)
    assert.isFunction(style.setProperty)
    assert.isFunction(style.removeProperty)
    assert.isFunction(style.getPropertyPriority)
    assert.isString(style.cssText)
    assert.isFunction(style.item)
  })

  it('should have expected result for Array.from()', () => {
    assert.deepEqual(Array.from(style), [])
    style.setProperty('color', 'red')
    style.setProperty('background-color', 'blue')
    assert.deepEqual(Array.from(style), ['color', 'background-color'])
  })

  it('should have expected result for [...style]', () => {
    assert.deepEqual([...style], [])
    style.setProperty('color', 'red')
    style.setProperty('background-color', 'blue')
    assert.deepEqual([...style], ['color', 'background-color'])
  })

  it('should have the correct toString() output', () => {
    assert.deepEqual(style.toString(), '[object CSSStyleDeclaration]')
  })

  it('should get and set property values', () => {
    style.setProperty('color', 'red')
    assert.equal(style.getPropertyValue('color'), 'red')
  })

  it('should get items by index', () => {
    style.setProperty('color', 'red')
    style.setProperty('background-color', 'blue')
    assert.equal(style[0], 'color')
    assert.equal(style[1], 'background-color')
  })

  it('should not set item by index', () => {
    style.color = 'red'
    assert.equal(style[0], 'color')
    style[0] = 'background-color'
    assert.equal(style[0], 'color')
  })

  it('should remove property values', () => {
    style.setProperty('color', 'red')
    assert.equal(style.removeProperty('color'), 'red')
    assert.equal(style.getPropertyValue('color'), '')
  })

  it('should remove property when value of setProperty is empty string', () => {
    style.setProperty('color', 'red')
    assert.equal(style.getPropertyValue('color'), 'red')
    style.setProperty('color', '')
    assert.equal(style.getPropertyValue('color'), '')
    assert.equal(style.length, 0)
  })

  it('remove property should return empty string when property is not set', () => {
    assert.equal(style.removeProperty('color'), '')
  })

  it('should get and set property riorities', () => {
    style.setProperty('color', 'red', 'important')
    assert.equal(style.getPropertyPriority('color'), 'important')
  })

  it('should not set css declaration when setProperty is called with !important in value', () => {
    style.setProperty('color', 'red !important')
    assert.equal(style.getPropertyValue('color'), '')
    assert.equal(style.getPropertyPriority('color'), '')
    assert.equal(style.length, 0)
  })

  it('should get and set cssText', () => {
    style.cssText = 'color: red; background-color: blue;'
    assert.equal(style.cssText, 'color: red; background-color: blue;')
  })

  it('should correctly parse and serialize cssText', () => {
    style.cssText = 'color: red; background: blue !important;'
    assert.equal(style.getPropertyValue('color'), 'red')
    assert.equal(style.getPropertyValue('background'), 'blue')
    assert.equal(style.getPropertyPriority('background'), 'important')
    assert.equal(style.cssText, 'color: red; background: blue !important;')
  })

  it('should return the correct length', () => {
    style.setProperty('color', 'red')
    style.setProperty('background-color', 'blue')
    assert.equal(style.length, 2)
  })

  it('should return the correct property name by index', () => {
    style.setProperty('color', 'red')
    style.setProperty('background-color', 'blue')
    assert.equal(style.item(0), 'color')
    assert.equal(style.item(1), 'background-color')
  })

  it('should support named properties', () => {
    style.color = 'red'
    style.backgroundColor = 'blue'
    assert.equal(style.color, 'red')
    assert.equal(style.backgroundColor, 'blue')
  })

  it('should cast argument value to string', () => {
    style['z-index'] = 10
    assert.equal(style['z-index'], '10')
  })
})
