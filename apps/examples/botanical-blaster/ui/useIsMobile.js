const checkMobile = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera
  const isMobileDevice =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    )

  const isSmallScreen = window.innerWidth <= 768

  return isSmallScreen
}

const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(checkMobile())

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(checkMobile())
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return isMobile
}

export default useIsMobile
