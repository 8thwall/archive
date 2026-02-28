import React, {useEffect} from 'react'
import {useFrame} from '@react-three/fiber'

import {useHcap} from './hooks/hcap'
import type {HcapInfo} from '../editor/asset-preview-types'

interface IHcap {
  src: string
  onLoad?: (metadata: HcapInfo) => void
}

const Hcap: React.FC<IHcap> = ({src, onLoad}) => {
  const hcap = useHcap(src)
  useFrame(() => hcap.tick())

  useEffect(() => {
    if (!hcap.mesh) {
      return
    }

    const metadata = hcap.getMetadata()
    onLoad?.({duration: metadata?.duration, faces: metadata?.maxIndexCount})
  }, [hcap])

  if (!src) {
    return null
  }

  return hcap.mesh && <primitive object={hcap.mesh} />
}

export {
  Hcap,
}
