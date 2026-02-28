export enum UpgradePaymentType {
  IMMEDIATE,
  INVOICE
}

export interface IUpgradePaymentSource {
  sourceId?: string
  type?: UpgradePaymentType
}
