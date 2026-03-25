export async function LoadReact() {
  // Load React and ReactDOM scripts
  await loadScript('https://unpkg.com/react@18/umd/react.production.min.js')
  await loadScript(
    'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js'
  )
}

// Function to dynamically load a script
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = src
    document.head.appendChild(script)
    script.onload = () => {
      resolve()
    }
  })
}
