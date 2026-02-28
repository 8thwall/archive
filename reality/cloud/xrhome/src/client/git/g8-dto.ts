import type {ModuleDependency} from '../../shared/module/module-dependency'

interface IG8ChangesetFile {
  status: number
  path: string
  previousPath: string
  dirty: boolean
}

interface IG8Changeset {
  commitId: string
  description: string
  files: IG8ChangesetFile[]
  id: string
  remoteBranch: string
  summary: string
  updated: boolean
}

interface IG8Client {
  name: string
  active: boolean
  forkId: string
  lastSaveTime: Date
}

interface IGitFile {
  repositoryName: string
  repoId: string
  filePath: string
  isDirectory: boolean
  mode: number
  timestamp: Date
  content: string
}

// repositoryName is mandatory for all g8 operations.
// handle is mandatory only for remote g8 operations.
// Apps use projectSpecifier for repositoryName.
// Modules use repoId for repositoryName.
interface IRepo {
  repositoryName: string
  repoId?: string
  handle?: string
  branchName?: string
  commitId?: string
  Prefix?: string
  workspace?: string
}

interface IG8MergeTriplet {
  original: string
  theirs: string
  yours: string
}

// NOTE(pawel) keep this in sync with g8-api.capnp.js
enum G8MergeAnalysisInfoStatus {
  MERGEABLE = 0,
  CONFLICTED = 1,
}

interface IG8MergeAnalysisInfo {
  status: G8MergeAnalysisInfoStatus
  path: string
  previousPath: string
  fileId: IG8MergeTriplet
  choice: number
  mergeBlobId: string
}

enum IG8MergeAnalysisInspectChangeSource {
  NONE,
  YOU,
  THEY,
  BOTH,
}

enum IG8MergeAnalysisInspectStatus {
  UNMODIFIED,
  MODIFIED,
  ADDED,
  DELETED,
}

interface IG8MergeAnalysisInspect {
  path: string
  nextBlobId: string
  previousBlobId: string
  source: IG8MergeAnalysisInspectChangeSource
  status: IG8MergeAnalysisInspectStatus
}

interface IG8Signature {
  name: string
  email: string
  when: Date
}

interface IG8Commit {
  id: string
  parentId?: string
  summary: string
  description: string
  signature: IG8Signature
  time?: number
}

interface IDeployment {
  master: string
  staging: string
  production: string
}

interface MergeDecision {
  fileId: IG8MergeTriplet
  mergeBlobId: string
  choice: MergeChoice
}

enum MergeChoice {
  Mine = 'mine',
  Theirs = 'theirs',
  Merge = 'merge',
}

interface IG8SyncParams {
  syncCommitId?: string
  mergeDecisions?: MergeDecision[]
  inspectRegex?: string
  inspectComplete?: boolean
  expectedMergeId?: IG8MergeTriplet
  additionalChanges?: Array<{
    path: string
    blobId: string
  }>
}

interface IG8PatchParams {
  ref?: string
}

interface IG8DiffParams {
  repositoryName: string
  repoId: string
  basePoint?: string     // default FORK (set in g8-git.ts)
  changePoint?: string   // default HEAD (ditto)
  findRenames?: boolean  // default false
}

interface IG8InspectParams {
  repositoryName: string
  inspectPoint: string
  inspectRegex: string
}

type IG8GitProgressLoad = 'UNSPECIFIED' | 'START' |
  'NEEDS_INIT' |  // The remote repo might exist, but doesn't have an initial commit regardless.
  'HAS_REPO_NEEDS_CLONE' |  // The remote repo exists, but we don't have it locally.
  'INIT_REPO' |
  'COPY_REPO' | 'CLONE_REPO' | 'SYNC_MASTER' | 'CHECK_CLIENTS' | 'INIT_DEFAULT_CLIENT' |
  'CLIENTS_OK' | 'CHECK_ACTIVE_CLIENT' | 'SET_ACTIVE_CLIENT' |
  'ACTIVE_CLIENT_OK' | 'LOADING_FILES' | 'DONE'

interface IG8GitProgress {

  client: 'UNSPECIFIED' | 'START' | 'DONE'

  land: 'UNSPECIFIED' | 'START' | 'SYNCING' | 'CLEAN_UP' | 'LOADING_FILES' | 'DONE'

  load: IG8GitProgressLoad

  save: 'UNSPECIFIED' | 'START' | 'DONE'

  sync: 'UNSPECIFIED' | 'START' | 'DONE'

  diff: 'UNSPECIFIED' | 'REQUEST_SENT' | 'READY' | 'FAILED'
}

interface IVisualizeOptions {
  showAdvance?: boolean
  showAdvanceAll?: boolean
  showAdvanceProd?: boolean
  showAdvanceStaging?: boolean
}

// NOTE(pawel) this reflects the order/mapping in the generated g8-api.capnp.js
enum G8DiffLineOrigin {
  CONTEXT,
  ADDITION,
  DELETION,
  CONTEXT_EOFNL,  // both files have no newline at end
  ADD_EOFNL,      // base has no newline, change does
  DEL_EOFNL,      // base has newline, change does not
  FILE_HDR,
  HUNK_HDR,
  BINARY,         // binary files differ
}

enum IG8FileInfoStatus {
  UNMODIFIED,
  ADDED,
  DELETED,
  MODIFIED,
  TYPE_CHANGED,
  COPIED,
  RENAMED,
  IGNORED,
  CONFLICTED,
  UNREADABLE,
}

interface IG8FileInfo {
  status: IG8FileInfoStatus
  path: string
  previousPath: string
  dirty: boolean
  blobId: string     // NOTE(pawel) currently (10/30/19), only set by g8Diff
  oldBlobId: string  // NOTE(pawel) currently (10/30/19), only set by g8Diff
}

interface IDiffLine {
  origin: G8DiffLineOrigin
  content: string
  baseLineNumber: number  // line number in original file, -1 for deletion
  newLineNumber: number   // line number in new file, -1 for deletion
}

interface IG8FileDiff {
  info: IG8FileInfo
  lines: IDiffLine[]
}

interface IDiffInfo {
  diffList: IG8FileDiff[]
  blobContents: { [index: string]: string }  // maps all oids in diffList to respective contents
}

interface IGit {
  repo: IRepo
  files: IGitFile[]
  filePaths: string[]
  filesByPath: Record<string, IGitFile>
  childrenByPath: Record<string, string[]>
  topLevelPaths: string[]
  clients: IG8Client[]
  remoteClients: IG8Client[]
  changesets: Record<string, IG8Changeset>
  logs: IG8Commit[]
  deployment: IDeployment
  merges: IG8MergeAnalysisInfo[]
  mergeId: IG8MergeTriplet
  inspectResult: IG8MergeAnalysisInspect[]
  progress: IG8GitProgress
  diff: IDiffInfo
  conflicts: IG8MergeAnalysisInfo[]
  appUuid: string
}

interface IMergeHunkBlock {
  start: number  // line number in merged file where block begins
  size: number   // length of block in merged file
}

interface IMergeHunk {
  original: IMergeHunkBlock
  theirs: IMergeHunkBlock
  yours: IMergeHunkBlock
}

interface G8DiffResponse {
  diffList: IG8FileDiff[]
}

interface G8InspectResponse {
  info: Pick<IG8FileInfo, 'path' | 'blobId'>[]
}

interface G8GetBlobsResponse {
  data: string[]
}

interface DependencyDiff {
  dependencyId: string
  alias: string
  previousAlias?: string  // Set only when alias changes.
  status: 'ADDED' | 'DELETED' | 'MODIFIED'
  filePath: string
  previousFilePath?: string  // If the file path change, what the previous one was.
  currentContents?: ModuleDependency
  previousContents?: ModuleDependency
}

type IReadonlyRepo = Readonly<IRepo>

export {
  IG8ChangesetFile,
  IG8Changeset,
  IG8Client,
  IGitFile,
  IReadonlyRepo as IRepo,
  IRepo as IMutableRepo,
  IG8MergeTriplet,
  G8MergeAnalysisInfoStatus,
  IG8MergeAnalysisInfo,
  IG8Signature,
  IG8Commit,
  IDeployment,
  MergeDecision,
  MergeChoice,
  IG8SyncParams,
  IG8PatchParams,
  IG8DiffParams,
  IG8GitProgressLoad,
  IG8GitProgress,
  IVisualizeOptions,
  G8DiffLineOrigin,
  IG8FileInfoStatus,
  IG8FileInfo,
  IDiffLine,
  IG8FileDiff,
  IDiffInfo,
  IGit,
  IMergeHunkBlock,
  IMergeHunk,
  G8DiffResponse,
  DependencyDiff,
  IG8InspectParams,
  G8InspectResponse,
  G8GetBlobsResponse,
  IG8MergeAnalysisInspectStatus,
  IG8MergeAnalysisInspectChangeSource,
}
