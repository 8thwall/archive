import React from 'react'

const useCarousel = (defaultSlideName) => {
  const [currentSlide, setCurrentSlide] = React.useState(defaultSlideName)
  const select = slideName => (e) => {
    e.preventDefault()
    setCurrentSlide(slideName)
  }
  const active = slideName => (currentSlide === slideName)

  return [select, active]
}

export default useCarousel
