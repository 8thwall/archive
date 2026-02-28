import React from 'react'
import type {RuntimeMetadata} from '@ecs/shared/runtime-version'
import {generateRuntimeArtifactUrl} from '@nia/reality/shared/studio/generate-url'
import {useSuspenseQuery} from '@tanstack/react-query'
import type {EcsManifest} from '@nia/reality/shared/studio/ecs-manifest'

import {useResolvedRuntimeVersion} from './use-runtime-version'
import {useCurrentRepoId} from '../../git/repo-id-context'
import {useScopedGit} from '../../git/hooks/use-current-git'
import {MANIFEST_FILE_PATH} from '../../common/editor-files'

const fetchRuntimeMetadata = async (url: string): Promise<RuntimeMetadata> => {
  const response = await fetch(url, {
    mode: 'cors',
  })
  if (!response.ok) {
    throw new Error('Failed to fetch runtime metadata')
  }
  return response.json()
}

const useRuntimeMetadata = () => {
  const version = useResolvedRuntimeVersion()
  const repoId = useCurrentRepoId()
  const manifestContent = useScopedGit(repoId, git => git.filesByPath[MANIFEST_FILE_PATH]?.content)

  const overrideMetadataUrl = React.useMemo(() => {
    if (manifestContent) {
      try {
        const manifest: EcsManifest = JSON.parse(manifestContent)
        const {runtimeUrl} = manifest.config
        if (!runtimeUrl) {
          return null
        }

        return `${runtimeUrl.substring(0, runtimeUrl.lastIndexOf('/'))}/metadata.json`
      } catch {
        return null
      }
    }
    return null
  }, [manifestContent])

  const versionUrl = generateRuntimeArtifactUrl(version.patchTarget, 'metadata.json')

  return useSuspenseQuery({
    queryKey: ['runtimeMetadata', overrideMetadataUrl, versionUrl],
    queryFn: async () => {
      try {
        if (overrideMetadataUrl) {
          return await fetchRuntimeMetadata(overrideMetadataUrl)
        }
      } catch {
        // Continue
      }
      return fetchRuntimeMetadata(versionUrl)
    },
  }).data
}

export {
  useRuntimeMetadata,
}
