import React from 'react'

const AsyncImage = (props) => {
  const [loadedSrc, setLoadedSrc] = React.useState(null)
  React.useEffect(() => {
    setLoadedSrc(null)
    if (props.src) {
      const handleLoad = () => {
        setLoadedSrc(props.src)
      }
      const image = new Image()
      image.addEventListener('load', handleLoad)
      image.src = props.src
      return () => {
        image.removeEventListener('load', handleLoad)
      }
    }

    return null
  }, [props.src])
  if (loadedSrc === props.src) {
    return (
      <img {...props} alt={props.alt} />
    )
  }
  return null
}

export default AsyncImage
