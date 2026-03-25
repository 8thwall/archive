import './style.scss'

const getHeight = usingVh => (usingVh ? '100vh' : '100%')

// Create div.
let usingVh = false
const div = document.createElement('div')
div.id = 'myDiv'
div.style.height = getHeight(usingVh)
document.body.appendChild(div)

// On click switch beteween 100vh and 100%.
const btn = document.createElement('button')
btn.innerHTML = `height: ${getHeight(usingVh)}`
btn.onclick = () => {
  usingVh = !usingVh
  div.style.height = getHeight(usingVh)
  btn.innerHTML = `height: ${getHeight(usingVh)}`
}
document.body.appendChild(btn)
