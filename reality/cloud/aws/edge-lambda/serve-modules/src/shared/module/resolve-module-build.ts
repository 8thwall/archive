import type {GetItemCommandInput, GetItemCommandOutput} from '@aws-sdk/client-dynamodb'

import {keyForBuild, parseSkForTarget} from './module-build'
import type {ModuleTarget} from './module-target'
import {AttributesForRaw, fromAttributes} from '../typed-attributes'
import {isGreaterPatchVersion} from './compare-module-target'
import type {ModuleBuildData, ModuleChannelData, ModuleVersionData} from './module-build-data'

type BuildData = ModuleBuildData & ModuleVersionData & ModuleChannelData

type GetItem = (
  input: Pick<GetItemCommandInput, 'Key' | 'ProjectionExpression'>
) => Promise<GetItemCommandOutput>

const fetchModuleBuild = async (
  getItem: GetItem, moduleId: string, target: ModuleTarget, projection: string
): Promise<BuildData> => {
  const res = await getItem({
    Key: keyForBuild(moduleId, target),
    ProjectionExpression: projection,
  })

  if (!res || !res.Item) {
    return null
  }

  return fromAttributes(res.Item as AttributesForRaw<BuildData>)
}

const resolveModuleBuild = async (
  getItem: GetItem,
  moduleId: string,
  requestTarget: ModuleTarget,
  projection: string
) => {
  const fetchBuild = fetchModuleBuild.bind(null, getItem, moduleId)

  if (requestTarget.type === 'version' && requestTarget.pre) {
    // If the target is a pre-release version, try to look up the finalized version first.
    // That way after publish, we only need to do one lookup.

    // The pre target is always stored as patch, the user preference for post-release updates
    // is stored as the patch level in the target.
    const directPreTarget = {...requestTarget, level: 'patch' as const}
    const releaseTarget = {...requestTarget}
    delete releaseTarget.pre

    const releaseProjection = `patchTarget${projection ? `,${projection}` : ''}`

    const releaseBuild = await fetchBuild(releaseTarget, releaseProjection)
    if (releaseBuild) {
      const latestReleasePatch = parseSkForTarget(releaseBuild.patchTarget)
      const isPreNewer = isGreaterPatchVersion(directPreTarget, latestReleasePatch)
      if (!isPreNewer) {
        // The release has progressed beyond the chosen pre-release, so we'll serve that release
        return releaseBuild
      }
    }

    return fetchBuild(directPreTarget, projection)
  }

  return fetchBuild(requestTarget, projection)
}

export {
  resolveModuleBuild,
}
