const message = '<p>Tap cube to fire</p><p>Current Pool Entities: '

const poolMessageComponent = {
  schema: {
    messageEl: {type: 'selector'},
  },
  tick() {
    const poolComponent = this.el.components.pool
    const poolSize = poolComponent.availableEls.length + poolComponent.usedEls.length
    const usedPoolEntities = this.el.components.pool.usedEls.length
    this.data.messageEl.innerHTML = `${message + usedPoolEntities}/${poolSize}</p>`
  },
}

export {poolMessageComponent}
