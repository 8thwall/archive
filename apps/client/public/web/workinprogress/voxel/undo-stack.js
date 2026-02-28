function UndoStack(undoAction, redoAction, cleanUpAction) {
  this.currentNode = null
  this.canUndo = () => {
    return !!this.currentNode
  }
  this.undo = () => {
    if(!this.canUndo) {
      return
    }
    undoAction(this.currentNode.action)
    this.currentNode = this.currentNode.previousNode
  }
  this.canRedo = () => {
    return this.currentNode && this.currentNode.nextNode
  }
  this.redo = () => {
    if (!this.canRedo()) {
      return
    }
    redoAction(this.currentNode.nextNode.action)
    this.currentNode = this.currentNode.nextNode
  }
  this.push = action => {
    if (this.currentNode) {
      let cleanUpNode = this.currentNode.nextNode
      while (cleanUpNode) {
        cleanUpAction(cleanUpNode.action)
        cleanUpNode = cleanUpNode.nextNode
      }
    }
    const newNode = {
      action,
      previousNode: this.currentNode
    }
    if (this.currentNode) {
      this.currentNode.nextNode = newNode
    }
    this.currentNode = newNode
  }
  return this
}
