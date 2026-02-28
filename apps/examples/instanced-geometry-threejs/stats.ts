declare var Stats: any

const statsPipelineModule = () => {
  let stats_ = null
  return {
    name: 'stats',
    onAttach: () => {
      stats_ = new Stats()
      stats_.showPanel(0)
      stats_.dom.style.zIndex = 5000
      stats_.dom.style.position = 'absolute'
      stats_.dom.style.top = '0px'
      stats_.dom.style.left = '0px'
      document.body.appendChild(stats_.dom)
    },
    onUpdate: () => {
      stats_.update()
    },
    onDetach: () => {
      document.body.removeChild(stats_)
      stats_ = null
    },
  }
}

export {statsPipelineModule}
