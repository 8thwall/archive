// @sublibrary(:dom-core-lib)
/* eslint-disable @typescript-eslint/no-unused-vars */

import type {Document} from './document'
import type {Element} from './element'
import type {Node} from './node'
import type {CharacterData} from './character-data'
import type {Text} from './text'
import type {DocumentFragment} from './document-fragment'

import {DOMException} from './dom-exception'

const ELEMENT_NODE = 1
const ATTRIBUTE_NODE = 2
const TEXT_NODE = 3
const PROCESSING_INSTRUCTION_NODE = 7
const COMMENT_NODE = 8
const DOCUMENT_NODE = 9
const DOCUMENT_TYPE_NODE = 10
const DOCUMENT_FRAGMENT_NODE = 11

const isElement = (node: Node): boolean => node.nodeType === ELEMENT_NODE
const isAttribute = (node: Node): boolean => node.nodeType === ATTRIBUTE_NODE
const isText = (node: Node): boolean => node.nodeType === TEXT_NODE
const isDocument = (node: Node): boolean => node.nodeType === DOCUMENT_NODE
const isDocumentType = (node: Node | null): boolean => node?.nodeType === DOCUMENT_TYPE_NODE
const isDocumentFragment = (node: Node): boolean => node.nodeType === DOCUMENT_FRAGMENT_NODE

const isCharacterData = (node: Node): boolean => node.nodeType === TEXT_NODE ||
  node.nodeType === COMMENT_NODE ||
  node.nodeType === PROCESSING_INSTRUCTION_NODE

const hostMap = new WeakMap<DocumentFragment, Element>()

// Actual list of children in a Node.
const kidsMap = new WeakMap<Node, Node[]>()

const kids = (node: Node): Node[] => kidsMap.get(node)!

// Actual parent of a Node.
const parentMap = new WeakMap<Node, Node | null>()
const getParent = (node: Node): Node | null => parentMap.get(node)!

// The actual node document for a Node.
const nodeDocumentMap = new WeakMap<Node, Document>()
const nodeDocument = (node: Node): Document => nodeDocumentMap.get(node)!

// A DocumentFragment node has an associated host (null or an element in a different node tree). It
// is null unless otherwise stated.
const documentFragmentHost = (
  fragment: DocumentFragment
): Element | null => hostMap.get(fragment) ?? null

const adoptingStepsMap: Map<string, (node: Node, oldDocument: Document) => void> = new Map()
const insertionStepsMap: Map<string, (insertedNode: Node) => void> = new Map()
const removingStepsMap: Map<string, (removedNode: Node, oldParent: Node | null) => void> = new Map()
const childrenChangedStepsMap: Map<string, (parent: Node) => void> = new Map()
const postConnectionStepsMap: Map<string, (connectedNode: Node) => void> = new Map()

// Specifications may define adopting steps for all or some nodes. The algorithm is passed node and
// oldDocument, as indicated in the adopt algorithm.
// https://dom.spec.whatwg.org/#concept-node-adopt-ext
const adoptingSteps = (node: Node, oldDocument: Document): void => {
  const steps = adoptingStepsMap.get(node.nodeName)
  if (steps) {
    steps(node, oldDocument)
  }
}

// Specifications may define insertion steps for all or some nodes. The algorithm is passed
// insertedNode, as indicated in the insert algorithm below. These steps must not modify the node
// tree that insertedNode participates in, create browsing contexts, fire events, or otherwise
// execute JavaScript. These steps may queue tasks to do these things asynchronously, however.
// https://dom.spec.whatwg.org/#concept-node-insert-ext
const insertionSteps = (insertedNode: Node): void => {
  const steps = insertionStepsMap.get(insertedNode.nodeName)
  if (steps) {
    steps(insertedNode)
  }
}

// Specifications may define removing steps for all or some nodes. The algorithm is passed a node
// removedNode and a node-or-null oldParent, as indicated in the remove algorithm below.
// See: https://dom.spec.whatwg.org/#concept-node-remove-ext
const removingSteps = (removedNode: Node, oldParent: Node | null): void => {
  const steps = removingStepsMap.get(removedNode.nodeName)
  if (steps) {
    steps(removedNode, oldParent)
  }
}

// Specifications may define children changed steps for all or some nodes. The algorithm is passed
// no argument and is called from insert, remove, and replace data.
// https://dom.spec.whatwg.org/#concept-node-children-changed-ext
// [IMPLEMENTION NOTE] This seems like the spec is unclear, as the steps need to know the parent.
const childrenChangedSteps = (parent: Node): void => {
  const steps = childrenChangedStepsMap.get('childrenChangedSteps')
  if (steps) {
    steps(parent)
  }
}

// Specifications may also define post-connection steps for all or some nodes. The algorithm is
// passed connectedNode, as indicated in the insert algorithm below.
// See: https://dom.spec.whatwg.org/#concept-node-post-connection-ext
const postConnectionSteps = (connectedNode: Node): void => {
  const steps = postConnectionStepsMap.get(connectedNode.nodeName)
  if (steps) {
    steps(connectedNode)
  }
}

// A node is connected if its shadow-including root is a document.
// https://dom.spec.whatwg.org/#connected
const isConnected = (node: Node): boolean => isDocument(node.getRootNode())

// An object A is called an ancestor of an object B if and only if B is a descendant of A
const isAncestor = (nodeA: Node, nodeB: Node): boolean => {
  let next = nodeB.parentNode
  while (next) {
    if (next === nodeA) {
      return true
    }
    next = next.parentNode
  }
  return false
}

// An inclusive ancestor is an object or one of its ancestors.
const isInclusiveAncestor = (
  nodeA: Node,
  nodeB: Node
): boolean => nodeA === nodeB || isAncestor(nodeA, nodeB)

// An object A is a host-including inclusive ancestor of an object B, if either A is an inclusive
// ancestor of B, or if B’s root has a non-null host and A is a host-including inclusive ancestor of
// B’s root’s host.
// https://dom.spec.whatwg.org/#concept-tree-host-including-inclusive-ancestor
const isHostIncludingInclusiveAncestor = (nodeA: Node, nodeB: Node): boolean => {
  if (isInclusiveAncestor(nodeA, nodeB)) {
    return true
  }
  const rootB = nodeB.getRootNode()
  if (isDocumentFragment(rootB)) {
    const hostB = documentFragmentHost(rootB as DocumentFragment)
    if (hostB) {
      return isHostIncludingInclusiveAncestor(nodeA, hostB)
    }
  }
  return false
}

const typeIsFollowing = (startNode: Node, targetNodeType: number): boolean => {
  const traverse = (node: Node | null): boolean => {
    let next = node
    while (next) {
      if (next.nodeType === targetNodeType) {
        return true
      }

      if (next.firstChild) {
        next = next.firstChild
      } else if (next.nextSibling) {
        next = next.nextSibling
      } else {
        while (next && !next.nextSibling) {
          next = next.parentNode
        }
        if (next) {
          next = next.nextSibling
        }
      }
    }
    return false
  }
  let start: Node | null = startNode
  let nextNode = start.firstChild ?? start.nextSibling
  while (!nextNode && start) {
    start = start.parentNode
    nextNode = start ? start.nextSibling : null
  }
  return traverse(nextNode)
}

const typeIsPreceding = (startNode: Node, targetNodeType: number): boolean => {
  let next = startNode.previousSibling ?? startNode.parentNode
  while (next) {
    if (next.nodeType === targetNodeType) {
      return true
    }
    next = next.previousSibling ?? next.parentNode
  }
  return false
}

const hasMoreThanOneChildOfType = (child: Node, nodeType: number) => kids(child).reduce(
  // ---
  (acc: number, node: Node) => acc + (node.nodeType === nodeType ? 1 : 0), 0
) > 1

const hasOneChildOfType = (child: Node, nodeType: number) => kids(child).reduce(
  // ---
  (acc: number, node: Node) => acc + (node.nodeType === nodeType ? 1 : 0), 0
) === 1

const hasChildOfType = (child: Node, nodeType: number) => kids(child).some(
  // ---
  node => node.nodeType === nodeType
)

const hasElementChildNotChild = (node: Node, child: Node): boolean => kids(node).some(
  // ---
  el => el.nodeType === ELEMENT_NODE && el !== child
)

const hasDoctypeChildNotChild = (node: Node, child: Node): boolean => kids(node).some(
  // ---
  el => el.nodeType === DOCUMENT_TYPE_NODE && el !== child
)

// To ensure pre-insertion validity of a node into a parent before a child, run these steps:
// See: https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
const ensurePreInsertionValidity = (node: Node, parent: Node, child: Node | null): void => {
  // 1. If parent is not a Document, DocumentFragment, or Element node, then throw a
  // "HierarchyRequestError" DOMException.
  if (!(isDocument(parent) || isDocumentFragment(parent) || isElement(parent))) {
    throw new DOMException(
      'This node type does not support this method.', 'HierarchyRequestError'
    )
  }

  // 2. If node is a host-including inclusive ancestor of parent, then throw a
  // "HierarchyRequestError" DOMException.
  if (isHostIncludingInclusiveAncestor(node, parent)) {
    throw new DOMException(
      'The operation would yield an incorrect node tree.', 'HierarchyRequestError'
    )
  }

  // 3. If child is non-null and its parent is not parent, then throw a "NotFoundError"
  // DOMException.
  if (child && child.parentNode !== parent) {
    throw new DOMException(
      'The child node is not a child of this node.', 'NotFoundError'
    )
  }

  // 4. If node is not a DocumentFragment, DocumentType, Element, or CharacterData node, then throw
  // a "HierarchyRequestError" DOMException.
  if (!(isDocumentFragment(node) || isDocumentType(node) || isElement(node) ||
        isCharacterData(node))) {
    throw new DOMException(
      'This node type does not support this method.', 'HierarchyRequestError'
    )
  }

  // 5. If either node is a Text node and parent is a document, or node is a doctype and parent is
  // not a document, then throw a "HierarchyRequestError" DOMException.
  if ((isText(node) && isDocument(parent)) || (isDocumentType(node) && !isDocument(parent))) {
    throw new DOMException(
      'This operation is not supported.', 'HierarchyRequestError'
    )
  }

  // 6. If parent is a document, and any of the statements below, switched on the interface node
  // implements, are true, then throw a "HierarchyRequestError" DOMException.
  if (isDocument(parent)) {
    const children = kids(node)
    const parentChildren = kids(parent)
    let shouldThrow = false
    switch (node.nodeType) {
      case DOCUMENT_FRAGMENT_NODE:
        // If node has more than one element child or has a Text node child.
        if (hasMoreThanOneChildOfType(node, ELEMENT_NODE) || hasChildOfType(node, TEXT_NODE)) {
          shouldThrow = true
        } else if (hasOneChildOfType(node, ELEMENT_NODE) &&
            (hasChildOfType(parent, ELEMENT_NODE) ||
             isDocumentType(child) ||
             (child !== null && typeIsFollowing(child, DOCUMENT_TYPE_NODE)))) {
          // Otherwise, if node has one element child and either parent has an element child, child
          // is a doctype, or child is non-null and a doctype is following child.
          shouldThrow = true
        }
        break
      case ELEMENT_NODE:
        // parent has an element child, child is a doctype, or child is non-null and a doctype is
        // following child.
        if (hasChildOfType(parent, ELEMENT_NODE) || isDocumentType(child) ||
            (child !== null && typeIsFollowing(child, DOCUMENT_TYPE_NODE))) {
          shouldThrow = true
        }
        break
      case DOCUMENT_TYPE_NODE:
        // parent has a doctype child, child is non-null and an element is preceding child, or child
        // is null and parent has an element child.
        if (hasChildOfType(parent, DOCUMENT_TYPE_NODE) ||
            (child !== null && typeIsPreceding(child, ELEMENT_NODE)) ||
            (child === null && hasChildOfType(parent, ELEMENT_NODE))) {
          shouldThrow = true
        }
        break
      default:
        break
    }
    if (shouldThrow) {
      throw new DOMException(
        'This operation is not supported.', 'HierarchyRequestError'
      )
    }
  }
}

// The index of an object is its number of preceding siblings, or 0 if it has none.
const getIndex = (node: Node): number => {
  let next = node
  let numPrecedingSiblings = 0
  while (next.previousSibling) {
    numPrecedingSiblings++
    next = next.previousSibling
  }
  return numPrecedingSiblings
}

// To remove a node node, with an optional suppress observers flag, run these steps:
// https://dom.spec.whatwg.org/#concept-node-remove
const removeNode = (node: Node, suppressObservers: boolean = false): void => {
  // 1. Let parent be node’s parent.
  const parent = node.parentNode

  // 2. Assert: parent is non-null.
  if (!parent) {
    throw new Error('parent is null')
  }

  // 3. Let index be node’s index.
  const index = getIndex(node)

  // 4. For each live range whose start node is an inclusive descendant of node, set its start to
  // (parent, index).
  // [NOT IMPLEMENTED]

  // 5. For each live range whose end node is an inclusive descendant of node, set its end to
  // (parent, index).
  // [NOT IMPLEMENTED]

  // 6. For each live range whose start node is parent and start offset is greater than index,
  // decrease its start offset by 1.
  // [NOT IMPLEMENTED]

  // 7. For each live range whose end node is parent and end offset is greater than index, decrease
  // its end offset by 1.
  // [NOT IMPLEMENTED]

  // 8. For each NodeIterator object iterator whose root’s node document is node’s node document,
  // run the NodeIterator pre-removing steps given node and iterator.
  // [NOT IMPLEMENTED]

  // 9. Let oldPreviousSibling be node’s previous sibling.
  const oldPreviousSibling = node.previousSibling

  // 10. Let oldNextSibling be node’s next sibling.
  const oldNextSibling = node.nextSibling

  // 11. Remove node from its parent’s children.
  kids(parent).splice(index, 1)

  // 12. If node is assigned, then run assign slottables for node’s assigned slot.
  // [NOT IMPLEMENTED]

  // 13. If parent’s root is a shadow root, and parent is a slot whose assigned nodes is the empty
  // list, then run signal a slot change for parent.
  // [NOT IMPLEMENTED]

  // 14. If node has an inclusive descendant that is a slot, then:
  // [NOT IMPLEMENTED]

  // 1. Run assign slottables for a tree with parent’s root.
  // [NOT IMPLEMENTED]

  // 2. Run assign slottables for a tree with node.
  // [NOT IMPLEMENTED]

  // 15. Run the removing steps with node and parent.
  removingSteps(node, parent)

  // 16. Let isParentConnected be parent’s connected.
  const isParentConnected = isConnected(parent)

  // 17. If node is custom and isParentConnected is true, then enqueue a custom element callback
  // reaction with node, callback name "disconnectedCallback", and an empty argument list.
  // Note: It is intentional for now that custom elements do not get parent passed. This might
  // change in the future if there is a need.
  // [NOT IMPLEMENTED]

  // 18. For each shadow-including descendant descendant of node, in shadow-including tree order,
  // then:
  kids(node).forEach((descendant) => {
    // 1. Run the removing steps with descendant and null.
    removingSteps(descendant, null)

    // 2. If descendant is custom and isParentConnected is true, then enqueue a custom element
    // callback reaction with descendant, callback name "disconnectedCallback", and an empty
    // argument list.
    // [NOT IMPLEMENTED]
  })

  // 19. For each inclusive ancestor inclusiveAncestor of parent, and then for each registered of
  // inclusiveAncestor’s registered observer list, if registered’s options["subtree"] is true, then
  // append a new transient registered observer whose observer is registered’s observer, options is
  // registered’s options, and source is registered to node’s registered observer list.
  // [NOT IMPLEMENTED]

  // 20. If suppress observers flag is unset, then queue a tree mutation record for parent with « »,
  // « node », oldPreviousSibling, and oldNextSibling.
  // [NOT IMPLEMENTED]

  // NIA: Update the parentMap.
  parentMap.set(node, null)

  // 21. Run the children changed steps for parent.
  childrenChangedSteps(parent)
}

// To append to an ordered set: if the set contains the given item, then do nothing; otherwise,
// perform the normal list append operation.
const appendToOrdered = (node: Node, list: Node[]): void => {
  if (list.includes(node)) {
    return
  }
  list.push(node)
}

// To append to a list that is not an ordered set is to add the given item to the end of the list.
const appendToNonOrdered = (node: Node, list: Node[]): void => {
  list.push(node)
}

// To extend a list A with a list B, for each item of B, append item to A.
const extendList = (listA: Node[], listB: Node[]): void => {
  listB.forEach((item) => {
    listA.push(item)
  })
}

// To prepend to a list that is not an ordered set is to add the given item to the beginning of the
// list.
const prependToNonOrdered = (node: Node, list: Node[]): void => {
  list.unshift(node)
}

// To replace within a list that is not an ordered set is to replace all items from the list that
// match a given condition with the given item, or do nothing if none do.  See:
// https://infra.spec.whatwg.org/#list-replace
const replaceNonOrdered = (node: Node, list: Node[], condition: (node: Node) => boolean): void => {
  list.forEach((item, index) => {
    if (condition(item)) {
      list[index] = node
    }
  })
}

// To insert an item into a list before an index is to add the given item to the list between the
// given index − 1 and the given index. If the given index is 0, then prepend the given item to the
// list.
const insertBeforeIndex = (node: Node, list: Node[], index: number): void => {
  list.splice(index, 0, node)
}

// To adopt a node into a document, run these steps:
// https://dom.spec.whatwg.org/#concept-node-adopt
const adoptNode = (node: Node, document: Document): void => {
  // 1. Let oldDocument be node’s node document.
  const oldDocument = nodeDocument(node)

  // 2. If node’s parent is non-null, then remove node.
  if (node.parentNode) {
    removeNode(node)
  }

  // 3. If document is not oldDocument, then:
  if (document !== oldDocument) {
    // 1. For each inclusiveDescendant in node’s shadow-including inclusive descendants:
    [node, ...kids(node)].forEach((inclusiveDescendant) => {
      // 1. Set inclusiveDescendant’s node document to document.
      nodeDocumentMap.set(inclusiveDescendant, document)

      // 2. If inclusiveDescendant is an element, then set the node document of each attribute in
      // inclusiveDescendant’s attribute list to document.
      if (inclusiveDescendant.nodeType === 1 /* Node.ELEMENT_NODE */) {
        for (const attr of (inclusiveDescendant as Element).attributes) {
          nodeDocumentMap.set(attr, document)
        }
      }
    })

    // 2. For each inclusiveDescendant in node’s shadow-including inclusive descendants that is
    // custom, enqueue a custom element callback reaction with inclusiveDescendant, callback name
    // "adoptedCallback", and an argument list containing oldDocument and document.
    // [NOT IMPLEMENTED]

    // 3. For each inclusiveDescendant in node’s shadow-including inclusive descendants, in
    // shadow-including tree order, run the adopting steps with inclusiveDescendant and oldDocument.
    ;[node, ...kids(node)].forEach((inclusiveDescendant) => {
      adoptingSteps(inclusiveDescendant, oldDocument!)
    })
  }
}

// To determine the length of a node node, run these steps:
// See: https://dom.spec.whatwg.org/#concept-node-length
const nodeLength = (node: Node): number => {
  // If node is a DocumentType or Attr node, then return 0.
  if (isDocumentType(node) || isAttribute(node)) {
    return 0
  }
  // If node is a CharacterData node, then return node’s data’s length.
  if (isCharacterData(node)) {
    return (node as CharacterData).data.length
  }

  // Return the number of node’s children.
  return kids(node).length
}

// To append to an ordered set: if the set contains the given item, then do nothing; otherwise,
// perform the normal list append operation.

// To insert a node into a parent before a child, with an optional suppress observers flag, run
// these steps:
// See: https://dom.spec.whatwg.org/#concept-node-insert
const insertNode = (
  node: Node, parent: Node, child: Node | null, suppressObservers = false
): void => {
  // 1. Let nodes be node’s children, if node is a DocumentFragment node; otherwise « node ».
  const nodes: Node[] = isDocumentFragment(node) ? Array.from(kids(node)) : [node]

  // 2. Let count be nodes’s size.
  const count = nodes.length

  // 3. If count is 0, then return.
  if (count === 0) {
    return
  }

  // 4. If node is a DocumentFragment node, then:
  if (isDocumentFragment(node)) {
    // 1. Remove its children with the suppress observers flag set.
    nodes.forEach((n) => {
      removeNode(n, true)
    })

    // 2. Queue a tree mutation record for node with « », nodes, null, and null.
    // Note: This step intentionally does not pay attention to the suppress observers flag.
    // [NOT IMPLEMENTED]
  }

  // 5. If child is non-null, then:
  // [NOT IMPLEMENTED]
  // if (child) {
  // 1. For each live range whose start node is parent and start offset is greater than child’s
  // index, increase its start offset by count.

  // 2. For each live range whose end node is parent and end offset is greater than child’s
  // index, increase its end offset by count.
  // }

  // 6. Let previousSibling be child’s previous sibling or parent’s last child if child is null.
  const previousSibling = child ? child.previousSibling : parent.lastChild

  // 7. For each node in nodes, in tree order:
  nodes.forEach((n) => {
    // 1. Adopt node into parent’s node document.
    adoptNode(n, nodeDocument(parent))

    // NIA: Update the parentMap.
    parentMap.set(n, parent)

    // 2. If child is null, then append node to parent’s children.
    if (!child) {
      appendToOrdered(n, kids(parent))
    } else {  // 3. Otherwise, insert node into parent’s children before child’s index.
      insertBeforeIndex(n, kids(parent), getIndex(child))
    }

    // 4. If parent is a shadow host whose shadow root’s slot assignment is "named" and node is a
    // slottable, then assign a slot for node.
    // [NOT IMPLEMENTED]

    // 5. If parent’s root is a shadow root, and parent is a slot whose assigned nodes is the
    // empty list, then run signal a slot change for parent.
    // [NOT IMPLEMENTED]

    // 6. Run assign slottables for a tree with node’s root.
    // [NOT IMPLEMENTED]

    // 7. For each shadow-including inclusive descendant inclusiveDescendant of node, in
    // shadow-including tree order:
    [n, ...kids(n)].forEach((inclusiveDescendant: Node) => {
      // 1. Run the insertion steps with inclusiveDescendant.
      insertionSteps(inclusiveDescendant)

      // 2. If inclusiveDescendant is connected, then:
      // [NOT IMPLEMENTED]
      // if (isConnected(inclusiveDescendant)) {
      // 1. If inclusiveDescendant is custom, then enqueue a custom element callback reaction
      // with inclusiveDescendant, callback name "connectedCallback", and an empty argument
      // list.
      // [NOT IMPLEMENTED]

      // 2. Otherwise, try to upgrade inclusiveDescendant.
      // Note: If this successfully upgrades inclusiveDescendant, its connectedCallback will be
      // enqueued automatically during the upgrade an element algorithm.
      // [NOT IMPLEMENTED]
      // }
    })
  })

  // 8. If suppress observers flag is unset, then queue a tree mutation record for parent with
  // nodes, « », previousSibling, and child.
  // [NOT IMPLEMENTED]

  // 9. Run the children changed steps for parent.
  childrenChangedSteps(parent)

  // 10. Let staticNodeList be a list of nodes, initially « ».
  // Note: We collect all nodes before calling the post-connection steps on any one of them,
  // instead of calling the post-connection steps while we’re traversing the node tree. This is
  // because the post-connection steps can modify the tree’s structure, making live traversal
  // unsafe, possibly leading to the post-connection steps being called multiple times on the same
  // node.
  const staticNodeList: Node[] = []

  // 11. For each node of nodes, in tree order:
  nodes.forEach((n) => {
    // 1. For each shadow-including inclusive descendant inclusiveDescendant of node, in
    // shadow-including tree order, append inclusiveDescendant to staticNodeList.
    [n, ...kids(n)].forEach((inclusiveDescendant: Node) => {
      appendToNonOrdered(inclusiveDescendant, staticNodeList)
    })
  })
  // 12. For each node of staticNodeList, if node is connected, then run the post-connection steps
  // with node.
  staticNodeList.forEach((n) => {
    if (isConnected(n)) {
      postConnectionSteps(n)
    }
  })
}

// To pre-insert a node into a parent before a child, run these steps:
// See: https://dom.spec.whatwg.org/#concept-node-pre-insert
const preInsertNode = (node: Node, parent: Node, child: Node | null): Node => {
  // 1. Ensure pre-insertion validity of node into parent before child.
  ensurePreInsertionValidity(node, parent, child)

  // 2. Let referenceChild be child.
  let referenceChild = child

  // 3. If referenceChild is node, then set referenceChild to node’s next sibling.
  if (referenceChild === node) {
    referenceChild = node.nextSibling
  }

  // 4. Insert node into parent before referenceChild.
  insertNode(node, parent, referenceChild)

  // 5. Return node.
  return node
}

// To append a node to a parent, pre-insert node into parent before null.
// https://dom.spec.whatwg.org/#concept-node-append
const appendNode = (node: Node, parent: Node): Node => preInsertNode(node, parent, null)

// To replace a child with node within a parent, run these steps:
const replaceNode = (child: Node, node: Node, parent: Node): Node => {
  // 1. If parent is not a Document, DocumentFragment, or Element node, then throw a
  // "HierarchyRequestError" DOMException.
  if (!(isDocument(parent) || isDocumentFragment(parent) || isElement(parent))) {
    throw new DOMException('The parent node is not valid.', 'HierarchyRequestError')
  }

  // 2. If node is a host-including inclusive ancestor of parent, then throw a
  // "HierarchyRequestError" DOMException.
  if (isHostIncludingInclusiveAncestor(node, parent)) {
    throw new DOMException(
      'The operation would yield an incorrect node tree.', 'HierarchyRequestError'
    )
  }

  // 3. If child’s parent is not parent, then throw a "NotFoundError" DOMException.
  if (child.parentNode !== parent) {
    throw new DOMException('The child node is not a child of this node.', 'NotFoundError')
  }

  // 4. If node is not a DocumentFragment, DocumentType, Element, or CharacterData node, then throw
  // a "HierarchyRequestError" DOMException.
  if (!(isDocumentFragment(node) || isDocumentType(node) ||
        isElement(node) || isCharacterData(node))) {
    throw new DOMException('The node type is not valid.', 'HierarchyRequestError')
  }

  // 5. If either node is a Text node and parent is a document, or node is a doctype and parent is
  // not a document, then throw a "HierarchyRequestError" DOMException.
  if ((isText(node) && isDocument(parent)) || (isDocumentType(node) && !isDocument(parent))) {
    throw new DOMException('The operation is not supported.', 'HierarchyRequestError')
  }

  // 6. If parent is a document, and any of the statements below, switched on the interface node
  // implements, are true, then throw a "HierarchyRequestError" DOMException.
  if (isDocument(parent)) {
    let shouldThrow = false
    switch (node.nodeType) {
      case DOCUMENT_FRAGMENT_NODE:
      // If node has more than one element child or has a Text node child.
        if (hasMoreThanOneChildOfType(node, ELEMENT_NODE) || hasChildOfType(node, TEXT_NODE)) {
          shouldThrow = true
        } else if (hasOneChildOfType(node, ELEMENT_NODE) &&
          (hasElementChildNotChild(parent, child) || typeIsFollowing(child, DOCUMENT_TYPE_NODE))) {
          // Otherwise, if node has one element child and either parent has an element child that
          // is not child or a doctype is following child.
          shouldThrow = true
        }
        break
      case ELEMENT_NODE:
        // parent has an element child that is not child or a doctype is following child.
        if (hasElementChildNotChild(parent, child) || typeIsFollowing(child, DOCUMENT_TYPE_NODE)) {
          shouldThrow = true
        }
        break
      case DOCUMENT_TYPE_NODE:
        // parent has a doctype child that is not child, or an element is preceding child.
        // Note: The above statements differ from the pre-insert algorithm.
        if (hasDoctypeChildNotChild(parent, child) || typeIsPreceding(child, ELEMENT_NODE)) {
          shouldThrow = true
        }
        break
      default:
        break
    }
    if (shouldThrow) {
      throw new DOMException('The operation is not supported.', 'HierarchyRequestError')
    }
  }

  // 7. Let referenceChild be child’s next sibling.
  let referenceChild = child.nextSibling

  // 8. If referenceChild is node, then set referenceChild to node’s next sibling.
  if (referenceChild === node) {
    referenceChild = node.nextSibling
  }

  // 9. Let previousSibling be child’s previous sibling.
  const {previousSibling} = child

  // 10. Let removedNodes be the empty set.
  let removedNodes: Node[] = []

  // 11. If child’s parent is non-null, then:
  if (child.parentNode) {
    // 1. Set removedNodes to « child ».
    removedNodes = [child]

    // 2. Remove child with the suppress observers flag set.
    // Note: The above can only be false if child is node.
    removeNode(child, true)
  }

  // 12. Let nodes be node’s children if node is a DocumentFragment node; otherwise « node ».
  const nodes: Node[] = isDocumentFragment(node) ? Array.from(kids(node)) : [node]

  // 13. Insert node into parent before referenceChild with the suppress observers flag set.
  insertNode(node, parent, referenceChild, true)

  // 14. Queue a tree mutation record for parent with nodes, removedNodes, previousSibling, and
  // referenceChild.
  // [NOT IMPLEMENTED]

  // 15. Return child.
  return child
}

// To replace all with a node within a parent, run these steps:
// https://dom.spec.whatwg.org/#concept-node-replace-all
const replaceAll = (node: Node, parent: Node): void => {
  // 1. Let removedNodes be parent’s children.
  const removedNodes = Array.from(kids(parent))

  // 2. Let addedNodes be the empty set.
  let addedNodes: Node[] = []

  // 3. If node is a DocumentFragment node, then set addedNodes to node’s children.
  if (isDocumentFragment(node)) {
    addedNodes = Array.from(kids(node))
  } else if (node) {
    // 4. Otherwise, if node is non-null, set addedNodes to « node ».
    addedNodes = [node]
  }

  // 5. Remove all parent’s children, in tree order, with the suppress observers flag set.
  Array.from(kids(parent)).forEach((child: Node) => {
    removeNode(child, true)
  })

  // 6. If node is non-null, then insert node into parent before null with the suppress observers
  // flag set.
  if (node) {
    insertNode(node, parent, null, true)
  }

  // 7. If either addedNodes or removedNodes is not empty, then queue a tree mutation record for
  // parent with addedNodes, removedNodes, null, and null.
  // Note: This algorithm does not make any checks with regards to the node tree constraints.
  // Specification authors need to use it wisely.
  // [NOT IMPLEMENTED]
}

// To pre-remove a child from a parent, run these steps:
// See: https://dom.spec.whatwg.org/#concept-node-pre-remove
const preRemoveNode = (child: Node, parent: Node): Node => {
  // 1. If child’s parent is not parent, then throw a "NotFoundError" DOMException.
  if (child.parentNode !== parent) {
    throw new DOMException('The child node is not a child of this node.', 'NotFoundError')
  }

  // 2. Remove child.
  removeNode(child)

  // 3. Return child.
  return child
}
// To replace data of node node with offset offset, count count, and data data, run these steps:
// See: https://dom.spec.whatwg.org/#concept-cd-replace
const replaceData = (node: CharacterData, offset: number, countIn: number, data: string): void => {
  // 1. Let length be node’s length.
  const length = nodeLength(node)

  // 2. If offset is greater than length, then throw an "IndexSizeError" DOMException.
  if (offset > length) {
    throw new DOMException('The offset is greater than the node length.', 'IndexSizeError')
  }

  // 3. If offset plus count is greater than length, then set count to length minus offset.
  let count = countIn
  if (offset + count > length) {
    count = length - offset
  }

  // 4. Queue a mutation record of "characterData" for node with null, null, node’s data, « », « »,
  // null, and null.
  // [NOT IMPLEMENTED]

  // 5. Insert data into node’s data after offset code units.
  node.data = node.data.slice(0, offset) + data + node.data.slice(offset + count)

  // 6. Let delete offset be offset + data’s length.
  const deleteOffset = offset + data.length

  // 7. Starting from delete offset code units, remove count code units from node’s data.
  node.data = node.data.slice(0, deleteOffset) + node.data.slice(deleteOffset + count)

  // 8. For each live range whose start node is node and start offset is greater than offset but
  // less than or equal to offset plus count, set its start offset to offset.
  // [NOT IMPLEMENTED]

  // 9. For each live range whose end node is node and end offset is greater than offset but less
  // than or equal to offset plus count, set its end offset to offset.
  // [NOT IMPLEMENTED]

  // 10. For each live range whose start node is node and start offset is greater than offset plus
  // count, increase its start offset by data’s length and decrease it by count.
  // [NOT IMPLEMENTED]

  // 11. For each live range whose end node is node and end offset is greater than offset plus
  // count, increase its end offset by data’s length and decrease it by count.
  // [NOT IMPLEMENTED]

  // 12. If node’s parent is non-null, then run the children changed steps for node’s parent.
  if (node.parentNode) {
    childrenChangedSteps(node.parentNode)
  }
}

// To substring data with node node, offset offset, and count count, run these steps:
// See: https://dom.spec.whatwg.org/#concept-cd-substring
const substringData = (node: CharacterData, offset: number, count: number): string => {
  // 1. Let length be node’s length.
  const length = nodeLength(node)

  // 2. If offset is greater than length, then throw an "IndexSizeError" DOMException.
  if (offset > length) {
    throw new DOMException('The offset is greater than the node length.', 'IndexSizeError')
  }

  // 3. If offset plus count is greater than length, return a string whose value is the code units
  // from the offset-th code unit to the end of node’s data, and then return.
  if (offset + count > length) {
    return node.data.slice(offset)
  }

  // 4. Return a string whose value is the code units from the offsetth code unit to the
  // offset+count-th code unit in node’s data.
  return node.data.slice(offset, offset + count)
}

// The contiguous exclusive Text nodes of a node node are node, node’s previous sibling exclusive
// Text node, if any, and its contiguous exclusive Text nodes, and node’s next sibling exclusive
// Text node, if any, and its contiguous exclusive Text nodes, avoiding any duplicates.
// See: https://dom.spec.whatwg.org/#contiguous-text-nodes
const contiguousExclusiveTextNodes = (node: Text): Text[] => {
  const textNodes: Text[] = []
  let previous = node.previousSibling
  while (previous && isText(previous)) {
    textNodes.unshift(previous as Text)
    previous = previous.previousSibling
  }
  textNodes.push(node)
  let next = node.nextSibling
  while (next && isText(next)) {
    textNodes.push(next as Text)
    next = next.nextSibling
  }
  return textNodes
}

export {
  adoptNode,
  appendNode,
  preInsertNode,
  preRemoveNode,
  ensurePreInsertionValidity,
  removeNode,
  replaceNode,
  replaceAll,
  replaceData,
  insertNode,
  nodeLength,
  substringData,
  contiguousExclusiveTextNodes,
  isConnected,
  kids,
  kidsMap,
  parentMap,
  getParent,
  adoptingStepsMap,
  removingStepsMap,
  insertionStepsMap,
  postConnectionStepsMap,
  childrenChangedStepsMap,
  nodeDocumentMap,
  nodeDocument,
  replaceNonOrdered,
}
