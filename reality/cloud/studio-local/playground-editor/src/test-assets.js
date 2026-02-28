const logoImg = require('./assets/orange_logo.png')

document.addEventListener('DOMContentLoaded', () => {
  const imgElement = document.createElement('img')

  imgElement.src = logoImg
  imgElement.alt = 'Orange Logo'
  imgElement.style.height = '200px'

  document.body.appendChild(imgElement)
})
