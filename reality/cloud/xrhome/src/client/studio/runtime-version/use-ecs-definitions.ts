import React from 'react'
import {generateRuntimeArtifactUrl} from '@nia/reality/shared/studio/generate-url'
import {useSuspenseQuery} from '@tanstack/react-query'
import type {EcsManifest} from '@nia/reality/shared/studio/ecs-manifest'

import {useResolvedRuntimeVersion} from './use-runtime-version'
import {useCurrentRepoId} from '../../git/repo-id-context'
import {useScopedGit} from '../../git/hooks/use-current-git'
import {MANIFEST_FILE_PATH} from '../../common/editor-files'
import useActions from '../../common/use-actions'
import editorActions from '../../editor/editor-actions'

const useEcsDefinitions = () => {
  const version = useResolvedRuntimeVersion()
  const repoId = useCurrentRepoId()
  const manifestContent = useScopedGit(repoId, git => git.filesByPath[MANIFEST_FILE_PATH]?.content)
  const {fetchEcsDefinitions} = useActions(editorActions)

  const overrideMetadataUrl = React.useMemo(() => {
    if (manifestContent) {
      try {
        const manifest: EcsManifest = JSON.parse(manifestContent)
        const {runtimeUrl} = manifest.config
        if (!runtimeUrl) {
          return null
        }

        return `${runtimeUrl.substring(0, runtimeUrl.lastIndexOf('/'))}/ecs-definition-file.ts`
      } catch {
        return null
      }
    }
    return null
  }, [manifestContent])

  const versionUrl = generateRuntimeArtifactUrl(version.patchTarget, 'ecs-definition-file.ts')

  return useSuspenseQuery({
    queryKey: ['ecsDefinitionFile', overrideMetadataUrl, versionUrl],
    queryFn: async () => {
      try {
        if (overrideMetadataUrl) {
          return await fetchEcsDefinitions(overrideMetadataUrl)
        }
      } catch {
        // Continue
      }
      return fetchEcsDefinitions(versionUrl)
    },
  }).data
}

export {
  useEcsDefinitions,
}
