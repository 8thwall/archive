import {detectMeshComponent} from '../components/detect-mesh'

declare const AFRAME: any
declare const React: any
declare const XR8: any

let once = true

function VpsAFrameView() {
  const [projectWayspotNames, setProjectWayspotNames] = React.useState(['ted-thompson'])

  React.useEffect(() => {
    XR8.XrController.configure({imageTargets: []})  // Disable default image targets.

    if (once) {
      AFRAME.registerComponent('detect-mesh', detectMeshComponent)

      once = false
    }
    const html = document.getElementsByTagName('html')[0]
    const origHtmlClass = html.className
    document.body.insertAdjacentHTML('beforeend', require('../scenes/vps-aframe.html'))

    // Cleanup
    return () => {
      const ascene = document.getElementsByTagName('a-scene')[0]
      ascene.parentNode.removeChild(ascene)
      html.className = origHtmlClass
    }
  }, [])

  React.useEffect(() => {
    const wayspotStr = projectWayspotNames.join(', ')
    console.log(`Updated projectWayspotNames with ${wayspotStr}`)
    const scene = document.querySelector('a-scene')
    scene.removeAttribute('xrweb')
    scene.setAttribute(
      'xrweb',
      `enableVps: true; projectWayspots: ${wayspotStr};`
    )
  },
  [projectWayspotNames])

  const tapSetWayspotNames = (event) => {
    console.log(`Checked ${event.target.checked} - name ${event.target.value}`)
    const names = [...projectWayspotNames]

    if (event.target.checked) {
      names.push(event.target.value)
    } else {
      const index = names.indexOf(event.target.value)
      names.splice(index, 1)
    }

    setProjectWayspotNames(names)
  }

  const layoutWayspotNames = () => {
    const wayspotNames = ['ted-thompson', 'college-ave'].map(wayspotName => (
      <div key={wayspotName}>
        <input
          type='checkbox'
          value={wayspotName}
          checked={projectWayspotNames.includes(wayspotName)}
          name='wayspot-name' />
        <span>{wayspotName}</span>
      </div>
    ))

    return (
      <div onChange={tapSetWayspotNames}>
        {wayspotNames}
      </div>
    )
  }

  return (
    <React.Fragment>
      <div className='hud top-right'
        style={{
          color: 'black',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        }}
      >
        <div className='segment'>
          <h4>Specified Wayspots:</h4>
          {layoutWayspotNames()}
        </div>
      </div>
    </React.Fragment>
  )
}

export {VpsAFrameView}
