const buttonBehaviorComponent = {
  init() {
    const btn = document.getElementById('btn')

    const handleClick = () => {
      console.log('click')
    }
    btn.addEventListener('click', handleClick)
  },
}
export {buttonBehaviorComponent}
