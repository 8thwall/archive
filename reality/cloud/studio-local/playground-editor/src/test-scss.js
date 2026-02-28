document.addEventListener('DOMContentLoaded', () => {
  const element = document.createElement('h3')
  element.textContent = 'SCSS Test: Styled with Sass!'
  element.className = 'scss-header'

  const container = document.createElement('div')
  container.className = 'scss-container'

  const nested = document.createElement('p')
  nested.textContent = 'This paragraph is nested inside the container with SCSS styling.'
  nested.className = 'nested-text'

  container.appendChild(element)
  container.appendChild(nested)
  document.body.appendChild(container)
})
