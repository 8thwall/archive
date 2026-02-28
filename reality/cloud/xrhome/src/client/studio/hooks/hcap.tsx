import {useState, useRef, useEffect} from 'react'
import {useThree} from '@react-three/fiber'
import type {Object3D} from 'three'

import HoloVideoObjectThreeJS from '../../../third_party/holovideoobject/holovideoobject-threejs'
import HoloVideoObject from '../../../third_party/holovideoobject/holovideoobject'

const useHcap = (input: string | null | undefined) => {
  const {gl} = useThree()
  const hvoRef = useRef<HoloVideoObjectThreeJS>()
  const [hcapModel, setHcapModel] = useState<Object3D>()

  useEffect(() => {
    const hvo = new HoloVideoObjectThreeJS(gl, (mesh) => {
      // If the HVO was closed / effect unmounted during loading, we cancel the model setup.
      if (!mesh || hvo.state < HoloVideoObject.States.Opening) {
        return
      }

      mesh.position.set(0, 0, 0)
      mesh.rotation.set(0, -Math.PI, 0)
      mesh.castShadow = true
      hvo.play()

      setHcapModel(mesh)
    }, null, null)

    hvoRef.current = hvo
    if (input) {
      hvo.open(input, {audioEnabled: true, autoplay: true, minBuffers: 2, maxBuffers: 3})
    }

    return () => {
      hvo.close()
      hvoRef.current = null
      setHcapModel(null)
    }
  }, [gl, input])

  return {
    mesh: hcapModel,
    tick: () => hvoRef.current && hcapModel && hvoRef.current.update(),
    getMetadata: () => (hvoRef.current as any)?.fileInfo,
  }
}

export {
  useHcap,
}
