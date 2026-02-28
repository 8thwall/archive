const inviteOverlayComponent = {
  schema: {
    room: {type: 'string'},
  },
  update() {
    if (this.data.room) {
      const url = `${window.location.href}?room=${this.data.room}`
      const overlay = document.getElementById('inviteOverlay')
      overlay.insertAdjacentHTML('beforeend', `
        <img
          id='qr'
          src=https://8th.io/qr?${new URLSearchParams({url, margin: '2', v: '2'})}
          alt='QR Code'
        />`)

      const inviteIcon = document.getElementById('inviteIcon')
      const qr = document.getElementById('qr')
      const close = () => {
        this.el.removeEventListener('click', close)
        overlay.style.width = '30px'
        qr.style.display = 'none'
        inviteIcon.style.display = 'flex'
      }
      const show = () => {
        inviteIcon.style.display = 'none'
        overlay.style.width = '200px'
        qr.style.display = 'flex'
        this.el.addEventListener('click', close)
      }
      overlay.addEventListener('click', show)
    }
  },
}
export {inviteOverlayComponent}
