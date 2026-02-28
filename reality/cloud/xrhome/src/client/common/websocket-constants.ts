const EDITOR_SOCKET_BRANCHES = [
  'current-client', 'master', 'staging', 'production', 'editor-chat-channel']

const SOCKET_URL = 'wss://<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com/prod'
const ASSET_GENERATION_SOCKET_URL = BuildIf.ALL_QA
  ? 'wss://<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com/live'
  : ''
const LINK_SOCKET_URL = BuildIf.ALL_QA
  // DEV Socket URL
  ? 'wss://<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com/live/'
  // PROD Socket URL
  : 'wss://<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com/live/'

const getHmdSocketForCode = (code: string) => ({
  baseUrl: LINK_SOCKET_URL,
  params: {
    channel: `hmd.link.${code}`,
  },
})

const STUDIO_USE_SOCKET_URL = 'ws://localhost:62008/'

export {
  SOCKET_URL,
  LINK_SOCKET_URL,
  ASSET_GENERATION_SOCKET_URL,
  EDITOR_SOCKET_BRANCHES,
  STUDIO_USE_SOCKET_URL,
  getHmdSocketForCode,
}
