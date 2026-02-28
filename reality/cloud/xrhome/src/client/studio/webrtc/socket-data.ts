enum StudioLinkActionType {
  WEBRTC_OFFER = 'CLOUD_STUDIO/WEBRTC_OFFER',
  WEBRTC_ANSWER = 'CLOUD_STUDIO/WEBRTC_ANSWER',
}

type StudioWebRTCOfferData = {
  simulatorId: string
  webRTCData: unknown
}

type StudioWebRTCAnswerData = {
  simulatorId: string
  webRTCData: unknown
}

type StudioWebRTCAnswer = {
  action: StudioLinkActionType.WEBRTC_ANSWER
  data: StudioWebRTCAnswerData
}

type StudioWebRTCOffer = {
  action: StudioLinkActionType.WEBRTC_OFFER
  data: StudioWebRTCOfferData
}

type StudioMessage = StudioWebRTCOffer
  | StudioWebRTCAnswer

export {
  StudioLinkActionType,
  StudioWebRTCOfferData,
  StudioWebRTCAnswerData,
  StudioWebRTCAnswer,
  StudioWebRTCOffer,
  StudioMessage,
}
