import React from 'react'

import {combine, bool} from '../styles/classname-utils'
import * as classes from './doty-demo-hero.module.scss'

const DOTY_DEFAULT_LOCALE = 'en-US'

const DotyDemoHero = ({title, subtitle, locale}) => {
  const heroExperienceRef = React.useRef(null)
  const [dismissed, setDismissed] = React.useState(false)
  const queryString = locale === DOTY_DEFAULT_LOCALE ? '' : `?lang=${locale}`

  React.useEffect(() => {
    window.addEventListener('message', (event) => {
      const {data} = event
      if (data.action === 'dismiss') {
        setDismissed(true)
      }
    }, false)
  }, [])

  React.useEffect(() => {
    if (heroExperienceRef?.current?.contentWindow) {
      heroExperienceRef.current.contentWindow.focus()
    }
  }, [heroExperienceRef])

  return (
    <section className={classes.section}>
      <iframe
        className={classes.experience}
        id='my-iframe'
        src={`https://8w.8thwall.app/welcome${queryString}`}
        allow='camera;microphone;gyroscope;accelerometer;magnetometer;xr-spatial-tracking;'
        ref={heroExperienceRef}
      />
      <div className={combine(classes.container, bool(dismissed, classes.hide))}>
        <h1 className={classes.title}>
          {title}
        </h1>
        <p className={combine('d-none d-md-block text8-xl text-white noto-sans-jp', classes.copy)}>
          {subtitle}
        </p>
      </div>
    </section>
  )
}

export default DotyDemoHero
