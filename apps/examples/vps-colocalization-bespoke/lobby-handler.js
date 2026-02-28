const lobbyHandlerComponent = {
  init() {
    const startAR = () => {
      this.el.setAttribute('xrweb', 'enableVps: true; allowedDevices: any')
    }

    this.el.addEventListener('lobby8-countdowndone', startAR)
  },
}

export {lobbyHandlerComponent}
