import iconVariants from './icon'
import {deviceIsCompatible} from './device'

require('./style.css')
const popOverHtml = require('./pop-over.html')

let popOverElement_
let popOverAddress_
let popOverQr_
let selectedElement_
let collapseTimeout_

const injectFontHeader = () => {
  const link = document.createElement('link')
  link.setAttribute('href', 'https://fonts.googleapis.com/css?family=Nunito')
  link.setAttribute('rel', 'stylesheet')
  document.head.appendChild(link)
}

const createPopOverElement = () => {
  popOverElement_ = document.createElement('div')
  popOverElement_.classList.add('embed8-pop-over')
  popOverElement_.classList.add('embed8-fade')

  popOverElement_.innerHTML = popOverHtml
  document.body.appendChild(popOverElement_)
  popOverAddress_ = document.getElementById('embed8-address')
  popOverQr_ = document.getElementById('embed8-qr')
  return popOverElement_
}

const handleUnsupportedClick = (event) => {
  event.embed8Handled = true

  if (event.target.id === 'embed8-address') {
    return
  }

  event.preventDefault()

  if (event.currentTarget == selectedElement_) {
    collapse()
  } else {
    expand(event.currentTarget)
  }
}

const expand = (element) => {
  clearTimeout(collapseTimeout_)

  popOverElement_.classList.remove('embed8-hidden')
  popOverElement_.classList.remove('embed8-fade')
  selectedElement_ = element

  if (popOverElement_.parent != selectedElement_) {
    element.appendChild(popOverElement_)

    const shortLink = element.getAttribute('data-8code')
    popOverAddress_.textContent = `8th.io/${shortLink}`
    popOverQr_.src = `https://8th.io/qr/${shortLink}?v=2&margin=2`
  }
}

const collapse = () => {
  popOverElement_.classList.add('embed8-fade')
  collapseTimeout_ = setTimeout(() => {
    popOverElement_.classList.add('embed8-hidden')
  }, 300)
  selectedElement_ = null
}

const isTruthyAttribute = (element, attribute) => {
  const value = element.getAttribute(attribute)
  return value === 'true' || value === '' || value === attribute
}

const attachElement = (element) => {
  if (isTruthyAttribute(element, 'data-attached')) {
    // Attach can run multiple times (if called manually) so don't double attach.
    return
  }
  element.setAttribute('data-attached', 'true')
  element.classList.add('embed8-link')
  element.href = `https://8th.io/${element.getAttribute('data-8code')}`
  element.removeAttribute('hidden')

  if (element.childElementCount == 0 && !isTruthyAttribute(element, 'data-hide-text')) {
    const textSpan = document.createElement('span')
    textSpan.textContent = element.textContent || 'AR View'
    element.textContent = ''
    element.appendChild(textSpan)
  }

  if (!isTruthyAttribute(element, 'data-hide-icon')) {
    const imageElement = document.createElement('img')
    imageElement.classList.add('embed8-link-icon')

    const iconColor = element.getAttribute('data-icon-color') || (isTruthyAttribute(element, 'data-dark-theme') ? 'light' : 'purple')
    imageElement.src = iconVariants[iconColor] || iconVariants.purple

    if (isTruthyAttribute(element, 'data-icon-vertical')) {
      element.prepend(imageElement)
    } else {
      element.append(imageElement)
    }
  }

  if (!deviceIsCompatible()) {
    element.addEventListener('click', handleUnsupportedClick)
  }
}

export const attach = (args) => {
  const elements = Array.from(document.getElementsByTagName('a')).filter(e => e.getAttribute('data-8code'))
  elements.forEach(attachElement)

  if (args && args.expandFirst && elements.length > 0) {
    expand(elements[0])
  }
}

const initialSetup = () => {
  injectFontHeader()
  createPopOverElement()
  attach()

  if (!deviceIsCompatible()) {
    // This listener closes the bubble if you click away from a link.
    window.addEventListener('click', (event) => {
      event.embed8Handled || collapse()
    })
  }
}

const state = document.readyState
if (state === 'interactive' || state === 'complete') {
  initialSetup()
} else {
  document.addEventListener('DOMContentLoaded', initialSetup)
}
