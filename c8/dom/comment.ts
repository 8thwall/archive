// @sublibrary(:dom-core-lib)
import {CharacterData} from './character-data'
import type {Document} from './document'
import {Node} from './node'
import {nodeDocumentMap} from './node-internal'

class Comment extends CharacterData {
  constructor(data: string) {
    const doc: Document = (globalThis as any).document
    super(doc, '#comment', Node.COMMENT_NODE, data)
  }
}

const createComment = (ownerDocument: Document, data: string) => {
  const comment = new Comment(data)
  nodeDocumentMap.set(comment, ownerDocument)
  return comment
}

export {Comment, createComment}
