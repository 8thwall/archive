enum PolicyViolationStatus {
  UNSPECIFIED = 'Unspecified',
  VIOLATION = 'Violation',
  RESOLVED = 'Resolved',
}

enum PolicyViolationOwnerStatus {
  NONE = 'None',
  VIOLATION = 'Violation',
  RESOLVED = 'Resolved',
}

enum PolicyViolationType {
  UNSPECIFIED = 'Unspecified',
  INAPPROPRIATE_CONTENT = 'InappropriateContent',
  PAYMENT_FAILED = 'PaymentFailed',
  LICENSE_MISUSE = 'LicenseMisuse',
  REGION_RESTRICTION = 'RegionRestriction',
}

export {
  PolicyViolationStatus,
  PolicyViolationOwnerStatus,
  PolicyViolationType,
}
