// A React component for 8th Wall AFrame scenes. The scene HTML can be supplied, along with
// any components or primitives that should be registered, and any image targets that should be
// loaded if something other than the automatically loaded set is wanted. Passing
// DISABLE_IMAGE_TARGETS will prevent any image targets from loading, including ones that would
// otherwise enabled automatically.
declare let AFRAME: any
declare let React: any
declare let XR8: any

// Helper function to make sure that aframe components are only registered once, since they can't
// be cleanly unregistered.
const registeredComponents = new Set()
const registerComponents = components => components.forEach(({name, val}) => {
  if (registeredComponents.has(name)) {
    return
  }
  registeredComponents.add(name)
  AFRAME.registerComponent(name, val)
})

// Helper function to make sure that aframe primitives are only registered once, since they can't
// be cleanly unregistered.
const registeredPrimitives = new Set()
const registerPrimitives = primitives => primitives.forEach(({name, val}) => {
  if (registeredPrimitives.has(name)) {
    return
  }
  registeredPrimitives.add(name)
  AFRAME.registerPrimitive(name, val)
})

// Helper function to make sure that aframe shaders are only registered once, since they can't
// be cleanly unregistered.
const registeredShaders = new Set()
const registerShaders = shaders => shaders.forEach(({name, val}) => {
  if (registeredShaders.has(name)) {
    return
  }
  registeredShaders.add(name)
  AFRAME.registerShader(name, val)
})

interface INamedObject {
  name: string
  val: object
}

interface IAFrameSceneProps {
  sceneHtml: string
  imageTargets?: string[]
  components?: INamedObject[]
  primitives?: INamedObject[]
  shaders?: INamedObject[]
}
// A react component for loading and unloading an aframe scene. The initial scene contents should
// be specified as an html string in sceneHtml. All props must be specified when the component
// mounts. Updates to props will be ignored.
//
// Optionally, aframe coponents to register for this scene can be passed as [{name, val}] arrays.
// Care is needed here to not define the same component different across scenes, since aframe
// components can't be unloaded.
//
// Optionally imageTargets can be specified to override the set loaded by default.
function AFrameScene({sceneHtml, imageTargets, components, primitives, shaders}: IAFrameSceneProps) {
  React.useEffect(() => {
    if (imageTargets) {
      XR8.XrController.configure({imageTargets})
    }
    if (components) {
      registerComponents(components)
    }
    if (primitives) {
      registerPrimitives(primitives)
    }
    if (shaders) {
      registerShaders(shaders)
    }

    const html = document.getElementsByTagName('html')[0]
    const origHtmlClass = html.className
    document.body.insertAdjacentHTML('beforeend', sceneHtml)

    // Cleanup
    return () => {
      const ascene = document.getElementsByTagName('a-scene')[0]
      ascene.parentNode.removeChild(ascene)
      html.className = origHtmlClass
    }
  }, [])

  return (
    <React.Fragment></React.Fragment>
  )
}

const DISABLE_IMAGE_TARGETS = []

export {AFrameScene, DISABLE_IMAGE_TARGETS}
