export interface C8Omni8 {
  imageTargetTexture: any
  displayTexture: any
  displayWidth: number
  displayHeight: number
  name: string
}

export interface OmniDom {
  render(displayTexture: any): void
  updateViewLayout(c8Omni8: C8Omni8): void
}
