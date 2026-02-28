import {dispatchify} from '../common'
import authenticatedFetch from '../common/authenticated-fetch'
import type {AsyncThunk, DispatchifiedActions} from '../common/types/actions'
import {
  listModulesAction, patchModuleAction, createModuleAction, listPublicModulesAction,
  listPublicBrowseModulesAction,
} from './action-types'
import type {ModuleUpdates} from './action-types'
import {errorAction} from '../common/error-action'
import {rawActions as moduleGitActions} from '../git/module-git-actions'
import {gitLoadProgress} from '../git/core-git-actions'
import type {IFeaturedAppImage, IAppTag, IModule, IBrowseModule} from '../common/types/models'
import {MAX_MODULE_TITLE_LENGTH} from '../../shared/module/module-constants'
import type {ModulePublicDetail} from './module-public-detail'
import unauthenticatedFetch from '../common/unauthenticated-fetch'
import {getFeaturedDescriptionUrl} from '../../shared/module/module-featured-description'
import type {ModuleDependency} from '../../shared/module/module-dependency'
import {getModuleTargetParts} from '../../shared/module/module-target'
import {getVideoUrlHandle} from '../../shared/featured-video'
import type {CropArea} from '../common/image-cropper'
import {publicApiFetch} from '../common/public-api-fetch'

const FEATURED_MODULES_TAGS = ['featured']

const listTaggedModules = (tags: string[]) => publicApiFetch('/public-modules/list/tags', {
  method: 'POST',
  body: JSON.stringify({tags}),
})

const listModulesForAccount = (accountUuid: string) => async (dispatch) => {
  try {
    const res = await dispatch(authenticatedFetch(`/v1/modules/list/${accountUuid}`))
    dispatch(listModulesAction(accountUuid, res.modules))
  } catch (err) {
    dispatch(errorAction(err.message))
  }
}

const listPublicModules = () => async (dispatch) => {
  try {
    const res = await dispatch(listTaggedModules(FEATURED_MODULES_TAGS))
    dispatch(listPublicModulesAction(res.modules))
  } catch (err) {
    dispatch(errorAction(err.message))
  }
}

const listPublicModulesForAccount = (accountUuid: string) => async (dispatch) => {
  try {
    const res = await dispatch(publicApiFetch(`/public-modules/list/${accountUuid}`))
    dispatch(listPublicBrowseModulesAction(res.modules, accountUuid))
  } catch (err) {
    dispatch(errorAction(err.message))
  }
}

const fetchPublicModuleDetail = (
  moduleUuid: string
): AsyncThunk<ModulePublicDetail> => (dispatch) => {
  try {
    return dispatch(publicApiFetch(`/public-modules/details/${moduleUuid}`))
  } catch (err) {
    dispatch(errorAction(err.message))
    return null
  }
}

const loadModuleFeaturedDescription = (
  module: IBrowseModule
): AsyncThunk<string> => async (dispatch) => {
  if (!module?.featuredDescriptionId) {
    return ''
  }

  try {
    return dispatch(
      unauthenticatedFetch(getFeaturedDescriptionUrl(module.featuredDescriptionId))
    )
  } catch (err) {
    dispatch({type: 'ERROR', msg: `Unable to load description for module: ${module.uuid}`})
    throw err
  }
}

const patchModule = (moduleUuid: string, moduleUpdates: ModuleUpdates) => async (dispatch) => {
  try {
    const formData = new FormData()
    if (moduleUpdates.title !== undefined) {
      if (moduleUpdates.title.length > MAX_MODULE_TITLE_LENGTH) {
        throw Error(`Module title must be less than ${MAX_MODULE_TITLE_LENGTH} characters`)
      }
      formData.append('title', moduleUpdates.title)
    }
    if (moduleUpdates.description !== undefined) {
      formData.append('description', moduleUpdates.description)
    }
    if (moduleUpdates.file) {
      formData.append('coverImage', moduleUpdates.file)
    }
    if (moduleUpdates.compatibility) {
      formData.append('compatibility', moduleUpdates.compatibility)
    }
    if (typeof moduleUpdates.publicFeatured !== 'undefined') {
      formData.append('publicFeatured', moduleUpdates.publicFeatured.toString())
    }
    const {crop} = moduleUpdates
    const queryParams = crop
      ? `?left=${crop.x}&top=${crop.y}&width=${crop.width}&height=${crop.height}`
      : ''
    const res = await dispatch(authenticatedFetch(`/v1/modules/${moduleUuid}${queryParams}`, {
      method: 'PATCH',
      body: formData,
      json: false,
    }))
    dispatch(patchModuleAction(moduleUuid, res.module))
  } catch (err) {
    dispatch(errorAction(err.message))
  }
}

const createModule = (AccountUuid: string, newModule): AsyncThunk<IModule> => async (dispatch) => {
  try {
    if (newModule.title?.length > MAX_MODULE_TITLE_LENGTH) {
      throw Error(`Module title must be less than ${MAX_MODULE_TITLE_LENGTH} characters`)
    }
    const {module} = await dispatch(authenticatedFetch('/v1/modules/new', {
      method: 'POST',
      body: JSON.stringify({
        ...newModule,
        AccountUuid,
      }),
    })) as {module: IModule}
    dispatch(createModuleAction(AccountUuid, module))
    return module
  } catch (err) {
    dispatch(errorAction(err.message))
    return null
  }
}

interface duplicateOpts {
  name: string
  AccountUuid?: string
  commitId?: string
  isFork?: boolean
}

const duplicateModule = (
  srcModule: IBrowseModule,
  opts: duplicateOpts
) => async (dispatch) => {
  try {
    const {module: newModule} = await dispatch(
      authenticatedFetch(`/v1/modules/duplicate/${srcModule.uuid}`, {
        method: 'POST',
        body: JSON.stringify({
          ...opts,
        }),
      })
    )
    await dispatch(gitLoadProgress(newModule.repoId, 'NEEDS_INIT'))
    if (opts.isFork) {
      await dispatch(moduleGitActions.forkModuleRepo({
        newRepoId: newModule.repoId,
        srcRepoId: srcModule.repoId,
        srcModuleId: srcModule.uuid,
        srcCommitId: opts.commitId,
      }))
    } else {
      await dispatch(moduleGitActions.duplicateModuleRepo(
        newModule.repoId,
        srcModule.repoId,
        opts.commitId
      ))
    }
    dispatch(createModuleAction(newModule.AccountUuid, newModule))
    return newModule
  } catch (err) {
    dispatch(errorAction(err.message))
    return null
  }
}

type FetchModuleReadmeArgs = Pick<ModuleDependency, 'target' | 'moduleId'>

type FetchModuleReadmeResult = {readme: string}

const fetchModuleReadme = (
  args: FetchModuleReadmeArgs
): AsyncThunk<FetchModuleReadmeResult> => async (dispatch) => {
  const {target, moduleId} = args
  const query = new URLSearchParams({
    target: getModuleTargetParts(target).join('/'),
  })
  const apiPath = `/public-modules/module/readme/${moduleId}`
  return dispatch(publicApiFetch(`${apiPath}?${query}`))
}

interface IFeatureModuleFormState {
  featuredDescription?: string
  featuredVideoUrl?: string
  featuredTags?: IAppTag[]
  repoVisibility?: IModule['repoVisibility']
  publicFeatured?: boolean
  featuredImages?: IFeaturedAppImage[]
  archived?: boolean
}

const updateModuleFeatureMetadata = (
  moduleUuid: string,
  moduleFormState: IFeatureModuleFormState
) => async (dispatch) => {
  // Error handling done by caller.

  if (moduleFormState.featuredVideoUrl) {
    moduleFormState.featuredVideoUrl = getVideoUrlHandle(moduleFormState.featuredVideoUrl)
  }

  const updatedModule = await dispatch(
    (authenticatedFetch(`/v1/modules/featureMetadata/${moduleUuid}`, {
      method: 'PATCH',
      body: JSON.stringify(moduleFormState),
    }))
  )

  dispatch(patchModuleAction(moduleUuid, updatedModule))
}

type UploadFeaturedImageResponse = {featuredModuleImage: IFeaturedAppImage}

const uploadFeaturedImage = (
  moduleUuid: string,
  file: File,
  crop?: CropArea
): AsyncThunk<UploadFeaturedImageResponse> => (dispatch) => {
  let queryParams = ''
  if (crop) {
    queryParams = `?left=${crop.x}&top=${crop.y}&width=${crop.width}&height=${crop.height}`
  }
  const formData = new FormData()
  formData.append('image', file)
  return dispatch(authenticatedFetch<UploadFeaturedImageResponse>(
    `/v1/modules/featuredImage/${moduleUuid}/${queryParams}`, {
      method: 'POST',
      body: formData,
      json: false,
    }
  ))
}

const rawActions = {
  fetchPublicModuleDetail,
  listModulesForAccount,
  listPublicModules,
  listPublicModulesForAccount,
  patchModule,
  createModule,
  duplicateModule,
  loadModuleFeaturedDescription,
  fetchModuleReadme,
  updateModuleFeatureMetadata,
  uploadFeaturedImage,
}

type ModuleActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)

export {
  rawActions,
}

export type {
  ModuleActions,
}
