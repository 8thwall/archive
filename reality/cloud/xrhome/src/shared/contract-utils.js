const isContractAccepted = (contract) => {
  if (!contract) {
    return false
  }

  const signedThrough8thWallConsole =
    !!contract.AccountContractAgreements && !!contract.AccountContractAgreements[0]
  const signedExternally = !contract.isAvailableAsCanned && !!contract.signedDate
  return signedThrough8thWallConsole || signedExternally
}

const isActiveDefaultContract =
  contract => contract?.isAvailableAsCanned && contract?.AccountUuid === null

const areInvoicePaymentsAllowed = (account, contract) => (
  !!contract?.invoicePaymentsAllowed ||
    (contract?.AccountUuid === null && account.defaultAppLicenseInvoicePaymentsAllowed)
)

module.exports = {
  areInvoicePaymentsAllowed,
  isContractAccepted,
  isActiveDefaultContract,
}
