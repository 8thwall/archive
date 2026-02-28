import type {IShareLinkAccount, IShareLinkApp} from '../common/types/models'

type ShareLinkType = 'project' | 'controller-connect';

type ShareLink = {
  app: IShareLinkApp
  account: IShareLinkAccount
  clientName: string
  link: string
  linkType: ShareLinkType
  sessionId: string
}

enum LocalLinkActionType {
  START = 'LOCAL_LINK/START',
  STOP = 'LOCAL_LINK/STOP',
  UPDATE = 'LOCAL_LINK/UPDATE',
  READY = 'LOCAL_LINK/READY',
  HMD_CODE = 'LOCAL_LINK/HMD_CODE'
}

type ShareStartMessage = {
  action: LocalLinkActionType.START
  data: ShareLink
}

type ShareStopMessage = {
  action: LocalLinkActionType.STOP
  data: ShareLink
}

type ShareUpdateMessage = {
  action: LocalLinkActionType.UPDATE
  data: ShareLink
}

type ShareReadyMessage = {
  action: LocalLinkActionType.READY
  data: {
    sessionId: string
  }
}

type ShareHmdCodeMessage = {
  action: LocalLinkActionType.HMD_CODE
  data: {
    code: string
    deviceName: string
    sessionId: string
  }
}

type ShareMessageType = ShareStartMessage | ShareStopMessage | ShareUpdateMessage |
  ShareReadyMessage | ShareHmdCodeMessage

const getShareLinkSpecifier = (shareLink: ShareLink): string => shareLink.sessionId

export type {
  ShareLink,
  ShareLinkType,
  ShareStartMessage,
  ShareStopMessage,
  ShareUpdateMessage,
  ShareMessageType,
  ShareReadyMessage,
  ShareHmdCodeMessage,
}

export {
  getShareLinkSpecifier,
  LocalLinkActionType,
}
