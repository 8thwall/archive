// @sublibrary(:dom-core-lib)
import {Node} from './node'
import type {Document} from './document'
import {mixinChildNode, ChildNode} from './child-node'
import {
  mixinNonDocumentTypeChildNode,
  NonDocumentTypeChildNode,
} from './non-document-type-child-node'
import {throwIllegalConstructor} from './exception'

class CharacterData extends Node implements ChildNode, NonDocumentTypeChildNode {
  // A string representing the textual data contained in this object.
  data: string

  // Returns a number representing the size of the string contained in the object.
  readonly length: number

  constructor(ownerDocument: Document, nodeName: string, nodeType: number, data: string) {
    if (new.target === CharacterData) {
      throwIllegalConstructor()
    }
    super(ownerDocument, nodeName, nodeType, data)

    Object.defineProperty(this, 'data', {
      enumerable: true,
      configurable: false,
      get() {
        return this.nodeValue
      },
      set(content: string) {
        this.nodeValue = content
      },
    })

    Object.defineProperty(this, 'length', {
      enumerable: true,
      configurable: false,
      get() {
        return this.data.length
      },
    })
  }

  // Type narrowing for the ownerDocument property for any non-Document node.
  get ownerDocument(): Document {
    return super.ownerDocument!
  }

  // Appends the given string to the CharacterData.data string; when this method
  // returns, data contains the concatenated string.
  appendData(data: string): void {
    this.data += data
  }

  // Removes the specified amount of characters, starting at the specified
  // offset, from the CharacterData.data string; when this method returns, data
  // contains the shortened string.
  deleteData(offset: number, count: number): void {
    this.data = this.data.slice(0, offset) + this.data.slice(offset + count)
  }

  // Inserts the specified characters, at the specified offset, in the
  // CharacterData.data string; when this method returns, data contains the
  // modified string.
  insertData(offset: number, data: string): void {
    this.data = this.data.slice(0, offset) + data + this.data.slice(offset)
  }

  // Replaces the specified amount of characters, starting at the specified
  // offset, with the specified string; when this method returns, data contains
  // the modified string.
  replaceData(offset: number, count: number, data: string): void {
    this.data = this.data.slice(0, offset) + data + this.data.slice(offset + count)
  }

  // Returns a string containing the part of CharacterData.data of the specified
  // length and starting at the specified offset.
  substringData(offset: number, count: number): string {
    return this.data.slice(offset, offset + count)
  }
}
// Add mixin properties to the type via declaration merging.
interface CharacterData extends ChildNode {}  // eslint-disable-line no-redeclare
interface CharacterData extends NonDocumentTypeChildNode {}  // eslint-disable-line no-redeclare

// Add the mixin properties to CharacterData's prototype.
mixinChildNode(CharacterData.prototype)
mixinNonDocumentTypeChildNode(CharacterData.prototype)

export {CharacterData}
