import {useMemo} from 'react'

import type {ModuleVersionTarget} from '../../shared/module/module-target'
import type {VersionInfo} from '../../shared/module/module-target-api'
import {useSelector} from '../hooks'

type Module = {uuid: string}

const useModuleCommitTarget = (module: Module): Record<string, ModuleVersionTarget[]> => {
  const versions = useSelector(s => s.modules.versions[module.uuid])

  return useMemo(() => {
    const o: Record<string, ModuleVersionTarget[]> = {}

    const addTarget = (d: VersionInfo) => {
      if (d.commitId in o) {
        o[d.commitId].push(d.patchTarget)
      } else {
        o[d.commitId] = [d.patchTarget]
      }
    }

    versions?.patchData?.forEach(addTarget)
    versions?.prePatchData?.filter(e => !e.deprecated).forEach(addTarget)
    return o
  }, [versions])
}

export {useModuleCommitTarget}
