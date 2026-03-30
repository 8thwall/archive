import {FindOptions, Op, WhereOptions} from 'sequelize'
import {v4 as uuidv4, validate} from 'uuid'

import jwt from 'jsonwebtoken'

import {getAppForRequest, isPrivilegedRequest} from './api-key'
import {parseFormData} from './form-data'
import {makeExternalFormat} from './image-target/format'
import {uploadFlatImage, uploadConeImage} from './image-target/upload'
import {getImageDimensions} from './image-target/image'
import * as models from './models'
import {strictParseInt, strictParseFloat} from './strict-parse'
import {
  MAX_ORIGINAL_DIMENSION, MAX_AUTO_TARGETS, DEFAULT_TARGET_CIRCUMFERENCE, DEFAULT_ARC_ANGLE,
} from './image-target/constants'

import {respondInvalidInput, respondJson, respondNotFound} from './responses'

import {
  getCircumferenceRatio, getConinessForRadii, toHundredths,
} from './image-target/curved-geometry'
import {
  validateName, validateUserMetadata, validateCrop, validateStaticOrientation,
} from './image-target/validate'
import type {Request, Response} from './api-types'
import type {TargetGeometry} from './image-target/image-target-types'

const CONTINUATION_OPTION = 'continuation'
const SORT_BY_OPTIONS = {
  created: 'createdAt',
  updated: 'updatedAt',
  name: 'name',
  uuid: 'uuid',
} as const  // Maps param to column name

const parseColumnType = {
  createdAt: (item: string) => Number(item),
  updatedAt: (item: string) => Number(item),
  uuid: (item: string) => item,
  name: (item: string) => item,
}

const DEFAULT_LIMIT = 50
const DIRECTION_OPTIONS = ['asc', 'desc']
const NUMERIC_OPTIONS = {limit: {minValue: 1, maxValue: 500}}

// Filter targets based on provided inputs. If a filter is not specified it is implied
// that all options are selected.
const FILTER_OPTIONS = {
  type: ['flat', 'conical', 'cylindrical'],
  autoload: ['true', 'false'],
  metadata: ['set', 'unset'],
}

// Maps type filter to ImageTarget.type column
const GEOMETRY_FILTER_MAPPING = {
  flat: 'PLANAR',
  cylindrical: 'CYLINDER',
  conical: 'CONICAL',
} as const

const ALL_OPTIONS = new Set([
  CONTINUATION_OPTION,
  'by',  // SORT_BY_OPTIONS
  'dir',  // DIRECTION_OPTIONS
  'start',
  'after',
  'nameLike',
  ...Object.keys(NUMERIC_OPTIONS),
  ...Object.keys(FILTER_OPTIONS),
])

type Dir = 'asc' | 'desc'

const hasValue = (({value}: {value?: unknown}) => !!value)

const makeOp = (dir: Dir, inclusive: boolean) => {
  if (dir === 'asc') {
    return inclusive ? Op.gte : Op.gt
  } else {
    return inclusive ? Op.lte : Op.lt
  }
}

type FilterableImageTarget = {
  type: string
  status: string
  AppUuid: string
  name: string
  userMetadata?: string | null
}

type WhereCondition = WhereOptions<FilterableImageTarget>

const makeOpList = (op: typeof Op[keyof typeof Op]) => (
  listParam: WhereCondition[]
): WhereCondition => {
  const list = listParam.filter(Boolean)
  if (!list || list.length === 0) {
    return null
  }
  if (list.length === 1) {
    return list[0]
  }
  return {
    [op]: list,
  }
}

const makeAndOpList = makeOpList(Op.and)

const makeOrOpList = makeOpList(Op.or)

// Validate query parameter format and alert user of invalid options.
const validateQueryStringParameters = (request: Request) => {
  const multiValueOptions = request.multiValueQueryStringParameters || {}

  Object.keys(multiValueOptions).forEach((opt) => {
    if (!ALL_OPTIONS.has(opt)) {
      throw new Error('Invalid query parameter.')
    }
  })

  const {continuation, by = [], dir = [], start = [], after = []} = multiValueOptions

  if (continuation && continuation.length !== 1) {
    throw new Error('Only one continuation token may be present.')
  }

  const byLength = by.length
  const dirLength = dir.length
  const startLength = start.length
  const afterLength = after.length

  if (startLength + afterLength > byLength) {
    throw new Error('Number of start/after points cannot exceed number of sort-by options')
  }

  if ((startLength > 0 || afterLength > 0) && byLength === 0) {
    throw new Error('Must specify a sort by if specifying a start/after point')
  }

  if (dirLength > byLength) {
    throw new Error('Cannot specify more dir than sort by')
  }

  dir.forEach((d) => {
    if (!DIRECTION_OPTIONS.includes(d)) {
      throw new Error('Only asc and desc are valid directions.')
    }
  })
  by.forEach((b) => {
    if (!Object.keys(SORT_BY_OPTIONS).includes(b)) {
      throw new Error(`Only ${Object.keys(SORT_BY_OPTIONS).join(',')} are valid sort-by options.`)
    }
  })

  const bySet = new Set(by)
  if (bySet.size !== by.length) {
    throw new Error('Duplicated sort-by is not allowed.')
  }

  if (bySet.has('uuid') && by[by.length - 1] !== 'uuid') {
    throw new Error('uuid must be specified last.')
  }

  Object.keys(NUMERIC_OPTIONS).forEach((optName: keyof typeof NUMERIC_OPTIONS) => {
    const optArray = multiValueOptions[optName]
    const {minValue, maxValue} = NUMERIC_OPTIONS[optName]
    if (optArray && optArray.length !== 1) {
      throw new Error(`Numeric option (${optName}) can only be included at most once.`)
    }
    if (optArray) {
      const value = strictParseInt(optArray[0])
      if (!value || value < minValue || value > maxValue) {
        throw new Error(`Option ${optName} is outside the valid range (${minValue},${maxValue})`)
      }
    }
  })

  Object.keys(FILTER_OPTIONS).forEach((filterName: keyof typeof FILTER_OPTIONS) => {
    const validFilterValues = FILTER_OPTIONS[filterName]
    const optArray = multiValueOptions[filterName]
    if (!optArray) {
      return
    }
    if (optArray.length > validFilterValues.length) {
      throw new Error(`${filterName} can be specified at most ${validFilterValues.length} times`)
    }
    if ((new Set(optArray)).size !== optArray.length) {
      throw new Error(`Filter option values for ${filterName} must be unique`)
    }
    if (optArray.some(optValue => !validFilterValues.includes(optValue))) {
      throw new Error(`${filterName} acceptable values are ${validFilterValues.join(',')}`)
    }
  })

  if (multiValueOptions.nameLike) {
    const optArray = multiValueOptions.nameLike
    if (optArray.length > 5) {
      throw new Error('nameLike can only be specified 5 times')
    }
    if (optArray.some(like => like.length > 25)) {
      throw new Error('nameLike max character count is 25')
    }
  }
}

type PaginationOptions = {
  limit?: number
  sortBy?: Array<{
    columnName: string
    dir: Dir
    inclusive: boolean
    value?: number | string
  }>
  type?: Array<keyof typeof GEOMETRY_FILTER_MAPPING>
  autoload?: Array<string>
  metadata?: Array<string>
  nameLike?: Array<string>
  _runningCount?: number
}

const paginationOptionsFromRequest = (request: Request): PaginationOptions => {
  validateQueryStringParameters(request)
  const multiValueOptions = {...request.multiValueQueryStringParameters || {}}
  const {continuation} = multiValueOptions

  const paginationOptions: PaginationOptions = {}

  if (continuation) {
    try {
      // When a continuation token is issued, we don't support changing parameters on the fly.
      return jwt.verify(continuation[0],
        process.env.PUBLIC_API_CONTINUATION_TOKEN_SIGNING) as PaginationOptions
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(`Received invalid continuation token ${continuation[0]} (${err.message})`)
      throw new Error('Invalid continuation token.')
    }
  }

  // Currently we enforce only one specification of numeric values. If this needs to change
  // validateQueryStringParameters() also needs to be updated.
  Object.keys(NUMERIC_OPTIONS).forEach((optName: keyof typeof NUMERIC_OPTIONS) => {
    if (multiValueOptions[optName]) {
      paginationOptions[optName] = strictParseInt(multiValueOptions[optName][0])
    }
  })

  if (!paginationOptions.limit && !isPrivilegedRequest(request)) {
    paginationOptions.limit = DEFAULT_LIMIT
  }

  const dir = multiValueOptions.dir || []
  const start = multiValueOptions.start || []
  const after = multiValueOptions.after || []

  let sortBy: NonNullable<PaginationOptions['sortBy']> = []
  if (multiValueOptions.by) {
    sortBy = multiValueOptions.by.map(
      (by, idx) => ({
        columnName: SORT_BY_OPTIONS[by],
        dir: dir[idx] || 'asc',
        inclusive: !!start[idx],
        value: parseColumnType[SORT_BY_OPTIONS[by]](start[idx] || after[idx - start.length]),
      })
    )
  } else {
    sortBy = [{
      columnName: 'createdAt',
      dir: 'asc',
      inclusive: false,
    }]
  }

  if (sortBy[sortBy.length - 1].columnName !== 'uuid') {
    sortBy.push({
      columnName: 'uuid',
      inclusive: false,
      dir: sortBy[0].dir,
    })
  } else {
    const uuid = sortBy[sortBy.length - 1].value
    if (uuid && (typeof uuid !== 'string' || !validate(uuid))) {
      throw new Error('Invalid uuid.')
    }
  }

  // Only set filters if they are provided
  Object.keys(FILTER_OPTIONS).forEach((filterName: keyof typeof FILTER_OPTIONS) => {
    if (multiValueOptions[filterName]) {
      paginationOptions[filterName] = multiValueOptions[filterName]
    }
  })

  if (multiValueOptions.nameLike) {
    paginationOptions.nameLike = multiValueOptions.nameLike.map((opt) => {
      // Literal _ \ % need escaping.
      let escaped = opt.replace(/([\\_%])/g, '\\$1')
      escaped = escaped.includes('*') ? escaped : `*${escaped}*`
      return escaped.replace(/\*/g, '%')  // Wildcard * to postgres wildcard %
    })
  }

  paginationOptions.sortBy = sortBy

  return paginationOptions
}

const handleTargetsListGet = async (request: Request): Promise<Response> => {
  const appKey = request.pathParameters.app
  if (!appKey) {
    return respondInvalidInput('Missing app key in path')
  }

  let paginationOptions: PaginationOptions
  try {
    paginationOptions = paginationOptionsFromRequest(request)
  } catch (err) {
    return respondInvalidInput(err.message)
  }

  // Checks permissions and gets appUuid
  const app = await getAppForRequest({
    appKey,
  }, request, {
    extendAppQuery: {
      attributes: ['uuid', 'appKey'],
    },
  })

  if (!app) {
    return respondNotFound(`App: ${appKey}`)
  }

  const {sortBy, limit} = paginationOptions

  // ?by=created&start=3&by=name&start=hi&by=uuid&after=uuid2
  // [key condition]  [pre condition][key condition]  [        pre condition    ]   [ key condition]
  // (created >= 3) && (created > 3 || name >= hi) && ((created > 3  && name > hi) ||  uuid > uuid2)

  const conditionBlocks: WhereCondition[] = sortBy.filter(hasValue).map(({
    columnName, dir, inclusive, value,
  }, i) => {
    const preCondition = makeAndOpList(sortBy.slice(0, i).map(e => ({
      [e.columnName]: {[makeOp(e.dir, false)]: e.value},
    })))
    const keyCondition = {[columnName]: {[makeOp(dir, inclusive)]: value}}
    return makeOrOpList([preCondition, keyCondition])
  })
  const {type, autoload, metadata, nameLike} = paginationOptions
  if (type) {
    const types = type.map(t => GEOMETRY_FILTER_MAPPING[t])
    conditionBlocks.push({type: {[Op.in]: types}})
  }

  if (autoload && autoload.length === 1) {
    if (autoload[0] === 'true') {
      conditionBlocks.push({status: 'ENABLED'})
    } else if (autoload[0] === 'false') {
      conditionBlocks.push({status: {[Op.not]: 'ENABLED'}})
    }
  }

  if (metadata && metadata.length === 1) {
    if (metadata[0] === 'set') {
      conditionBlocks.push({userMetadata: {[Op.not]: null}})
    } else if (metadata[0] === 'unset') {
      conditionBlocks.push({userMetadata: {[Op.eq]: null}})
    }
  }

  if (nameLike) {
    conditionBlocks.push({name: {[Op.or]: nameLike.map(t => ({[Op.iLike]: t}))}})
  }

  const queryOptions: FindOptions<FilterableImageTarget> = {
    where: {
      AppUuid: app.uuid,
      status: {[Op.not]: 'DELETED'},
      [Op.and]: conditionBlocks,
    },
    order: sortBy.map(({columnName, dir}) => ([columnName, dir])),
  }

  if (limit) {
    // NOTE(christoph): We extend the limit by 1 to find out if there are any more targets after the
    // current page. (Is this really not something we can get sequelize to tell us?)
    // Then we slice off that extra element from the response, if present.
    queryOptions.limit = limit + 1
  }

  let rows = await models.use().ImageTarget.findAll(queryOptions)

  let continuationToken

  // Additional pages of data remain. Issue continuation token
  if (limit && rows.length > limit) {
    rows = rows.slice(0, limit)

    const tokenPayload = {
      ...paginationOptions,
      sortBy: sortBy.map((item, idx) => ({
        ...item,
        value: rows[rows.length - 1][item.columnName],
        inclusive: idx !== sortBy.length - 1,
      })),
    }
    if (process.env.SECRET_NAMESPACE === 'Dev') {
      tokenPayload._runningCount = (paginationOptions._runningCount || 0) + rows.length
    }
    continuationToken = jwt.sign(tokenPayload, process.env.PUBLIC_API_CONTINUATION_TOKEN_SIGNING)
  }

  const response = {
    targets: rows.map(t => makeExternalFormat(t, app.appKey)),
    continuationToken,
  }

  if (process.env.SECRET_NAMESPACE === 'Dev') {
    const count = await models.use().ImageTarget.count(queryOptions)
    // @ts-expect-error
    response.__internal__dev__ = {
      runningTotal: (paginationOptions._runningCount || 0) + rows.length,
      estimatedRemaining: count - rows.length,
    }
  }

  return respondJson(response)
}

const handleTargetsListPost = async (request: Request): Promise<Response> => {
  const {ImageTarget} = models.use()

  const appKey = request.pathParameters.app
  if (!appKey) {
    return respondInvalidInput('Missing app key in path')
  }

  let fields
  let files
  try {
    const bodyEncoding = request.isBase64Encoded ? 'base64' : 'utf8'
    ;({fields, files} = await parseFormData(request.headers, request.body, bodyEncoding))
  } catch (err) {
    return respondInvalidInput('Request body cannot be parsed')
  }

  const {
    name,
    type = 'PLANAR',
    metadata: userMetadata = null,
    metadataIsJson: userMetadataIsJsonString = 'true',
    loadAutomatically: loadAutomaticallyString = 'false',
    isRotated: isRotatedDeprecated = null,  // TODO(christoph) Remove after migrating xrhome
    'geometry.isRotated': isRotatedGeometry = 'false',
    'geometry.left': geometryLeft,
    'geometry.top': geometryTop,
    'geometry.width': geometryWidth,
    'geometry.height': geometryHeight,
    'geometry.topRadius': topRadius,
    'geometry.bottomRadius': bottomRadius,
    'geometry.staticOrientation': staticOrientationFields,
    ...rest
  } = fields

  const isRotatedString = isRotatedDeprecated !== null ? isRotatedDeprecated : isRotatedGeometry

  const unknownFields = Object.keys(rest)
  if (unknownFields.length) {
    return respondInvalidInput(`Unknown field(s) provided: ${unknownFields.join(', ')}`)
  }

  const nameError = validateName(name)
  if (nameError) {
    return respondInvalidInput(nameError)
  }

  if (!['PLANAR', 'CYLINDER', 'CONICAL'].includes(type)) {
    return respondInvalidInput('type must be "PLANAR", "CYLINDER", or "CONICAL".')
  }

  if (!['true', 'false'].includes(loadAutomaticallyString)) {
    return respondInvalidInput('loadAutomatically must be "true", "false", or unspecified.')
  }

  if (!['true', 'false'].includes(isRotatedString)) {
    return respondInvalidInput('geometry.isRotated must be "true", "false", or unspecified.')
  }

  if (!['true', 'false'].includes(userMetadataIsJsonString)) {
    return respondInvalidInput('userMetadataIsJson must be "true", "false", or unspecified.')
  }

  if (userMetadata !== null && typeof userMetadata !== 'string') {
    return respondInvalidInput('metadata must be a string or unspecified.')
  }

  if (type !== 'CONICAL') {
    const unexpectedFields = {
      topRadius,
      bottomRadius,
    }
    const unexpectedEntries = Object.entries(unexpectedFields)
      .filter(([, value]) => value !== undefined)
      .map(([key]) => key)

    if (unexpectedEntries.length) {
      return respondInvalidInput(`Unexpected fields(s) specified: ${unexpectedEntries.join(', ')}`)
    }
  }

  const loadAutomatically = loadAutomaticallyString === 'true'
  const isRotated = isRotatedString === 'true'
  const userMetadataIsJson = userMetadataIsJsonString === 'true'

  const metadataError = validateUserMetadata(userMetadata, userMetadataIsJson)
  if (metadataError) {
    return respondInvalidInput(metadataError)
  }

  const imageFile = files.image

  if (!imageFile) {
    return respondInvalidInput('Missing image file')
  }

  const imageBuffer = imageFile.data
  const contentType = imageFile.mimetype

  const {width: originalWidth, height: originalHeight} = await getImageDimensions(imageBuffer)

  if (originalWidth > MAX_ORIGINAL_DIMENSION || originalHeight > MAX_ORIGINAL_DIMENSION) {
    return respondInvalidInput(`Image dimensions cannot exceed ${MAX_ORIGINAL_DIMENSION}`)
  }

  if (!['image/png', 'image/jpeg'].includes(contentType)) {
    return respondInvalidInput(`Invalid Content type: ${contentType}`)
  }

  let geometry: TargetGeometry
  try {
    geometry = {
      left: strictParseInt(geometryLeft),
      top: strictParseInt(geometryTop),
      width: strictParseInt(geometryWidth),
      height: strictParseInt(geometryHeight),
      isRotated,
      originalWidth,
      originalHeight,
    }

    if (type !== 'PLANAR' && staticOrientationFields) {
      return respondInvalidInput(
        'geometry.staticOrientation can only be specified for flat (PLANAR) targets.'
      )
    }

    if (type === 'PLANAR' && staticOrientationFields) {
      if (typeof staticOrientationFields !== 'string' || staticOrientationFields.length === 0) {
        throw new Error('staticOrientationFields is not a nonzero-length string')
      }
      let staticOrientation
      try {
        staticOrientation = JSON.parse(staticOrientationFields)
      } catch (err) {
        return respondInvalidInput('geometry.staticOrientation must be valid JSON')
      }
      const staticOrientationError = validateStaticOrientation(staticOrientation)
      if (staticOrientationError) {
        return respondInvalidInput(staticOrientationError)
      }
      geometry.staticOrientation = staticOrientation
    }

    if (['CYLINDER', 'CONICAL'].includes(type)) {
      const cylinderCircumferenceTop = DEFAULT_TARGET_CIRCUMFERENCE
      const targetCircumferenceTop = (cylinderCircumferenceTop * DEFAULT_ARC_ANGLE) / 360
      const arcAngle = DEFAULT_ARC_ANGLE

      let cylinderCircumferenceBottom
      let coniness
      if (type === 'CONICAL') {
        Object.assign(geometry, {
          topRadius: strictParseFloat(topRadius),
          bottomRadius: strictParseFloat(bottomRadius),
        })
        cylinderCircumferenceBottom = toHundredths(
          cylinderCircumferenceTop / getCircumferenceRatio(
            geometry.topRadius,
            geometry.bottomRadius
          )
        )
        coniness = getConinessForRadii(geometry.topRadius, geometry.bottomRadius)
      } else {
        const aspect = originalWidth / originalHeight
        geometry.cylinderSideLength = toHundredths(
          isRotated
            ? targetCircumferenceTop * aspect
            : targetCircumferenceTop / aspect
        )
        cylinderCircumferenceBottom = cylinderCircumferenceTop
        coniness = 0
      }

      Object.assign(geometry, {
        cylinderCircumferenceTop,
        targetCircumferenceTop,
        cylinderCircumferenceBottom,
        arcAngle,
        coniness,
        inputMode: 'BASIC',
      })
    }
  } catch (err) {
    return respondInvalidInput('Missing or invalid geometry field specified')
  }

  const app = await getAppForRequest({
    appKey,
  }, request, {
    extendAccountInclude: {
      attributes: ['shortName'],
    },
  })

  if (!app) {
    return respondNotFound(`App: ${appKey}`)
  }

  // For non-privileged requests, app was already verified in the first call.
  const targetWithSameName = await ImageTarget.findOne({where: {AppUuid: app.uuid, name}})
  if (targetWithSameName) {
    return respondInvalidInput(`App already has image target with name: ${name}`)
  }

  if (loadAutomatically) {
    const autoTargetCount = await app.countImageTargets({where: {status: 'ENABLED'}})
    if (autoTargetCount >= MAX_AUTO_TARGETS) {
      return respondInvalidInput(`Cannot exceed ${MAX_AUTO_TARGETS} loadAutomatically targets.`)
    }
  }

  const {shortName} = app.Account

  let imagePaths

  if (type === 'CONICAL') {
    const uploadResult = await uploadConeImage(imageBuffer, geometry, contentType, shortName)
    if (uploadResult.validationError) {
      return respondInvalidInput(uploadResult.validationError)
    }
    Object.assign(geometry, uploadResult.geometryOverrides)
    imagePaths = uploadResult.paths
  } else {
    const cropError = validateCrop(originalWidth, originalHeight, geometry)
    if (cropError) {
      return respondInvalidInput(cropError)
    }
    imagePaths = await uploadFlatImage(imageBuffer, geometry, contentType, shortName)
  }

  const imageTarget = await ImageTarget.create({
    uuid: uuidv4(),
    AppUuid: app.uuid,
    name,
    type,
    status: loadAutomatically ? 'ENABLED' : 'DRAFT',
    isRotated,
    userMetadata,
    userMetadataIsJson,
    metadata: JSON.stringify(geometry),
    ...imagePaths,
  })

  return respondJson(makeExternalFormat(imageTarget, appKey))
}

export {
  handleTargetsListGet,
  handleTargetsListPost,
}
