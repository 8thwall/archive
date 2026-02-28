// @sublibrary(:dom-core-lib)
import type {Node} from './node'
import type {Document} from './document'

// To convert nodes into a node, given nodes and document, run these steps:
// See: https://dom.spec.whatwg.org/#converting-nodes-into-a-node
const convertNodesIntoNode = (nodes: (Node | string)[], document: Document): Node => {
  // 1. Let node be null.
  let node: Node | null = null

  // 2. Replace each string in nodes with a new Text node whose data is the string and node document
  // is document.
  nodes.forEach((n, index) => {
    if (typeof n === 'string') {
      nodes[index] = document.createTextNode(n)
    }
  })
  const nodesAsNodes = nodes as Node[]

  // 3. If nodes contains one node, then set node to nodes[0].
  if (nodesAsNodes.length === 1) {
    [node] = nodesAsNodes
  } else {
    // 4. Otherwise, set node to a new DocumentFragment node whose node document is document, and
    // then append each node in nodes, if any, to it.
    node = document.createDocumentFragment()
    nodesAsNodes.forEach((n) => {
      node!.appendChild(n)
    })
  }
  // 5. Return node.
  return node
}

export {convertNodesIntoNode}
