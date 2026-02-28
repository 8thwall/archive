import React from 'react'

// iframe containing AR content.
const IFRAME_ID = 'inline-ar-iframe'

interface IInlinAR {
  url: string
  requireRegisterXRIFrame?: boolean
  isVisibleCallback: (v: boolean) => void
}

const InlineAR: React.FunctionComponent<IInlinAR> = ({
  url, isVisibleCallback, requireRegisterXRIFrame = false,
}) => {
  const iframeRef = React.useRef<HTMLIFrameElement>(null!)
  const divRef = React.useRef<HTMLDivElement>(null!)
  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          document.getElementById(IFRAME_ID).setAttribute('src', '')
          isVisibleCallback(false)
        }
      })
    }, {threshold: 0.2})
    observer.observe(divRef.current)
    return () => {
      if (typeof divRef.current === 'Element') {
        observer.unobserve(divRef.current)
      }
    }
  }, [])


  React.useEffect(() => {
    if (requireRegisterXRIFrame) {
      window.XRIFrame.registerXRIFrame(IFRAME_ID)
    }
    iframeRef.current?.setAttribute('src', url)

    return () => {
      if (requireRegisterXRIFrame) {
        window.XRIFrame.deregisterXRIFrame()
      }
    }
  }, [])


  return (
    <div id='inline-ar' ref={divRef}>
      <iframe
        ref={iframeRef}
        style={{marginTop: '10%'}}
        title='Face Effects Inline AR'
        id='inline-ar-iframe'
        allow='camera;microphone;gyroscope;accelerometer;'
      />
    </div>
  )
}

export default InlineAR
