const generateConnectDashboardLink = (accountUuid: string) => `/v1/payments/login/${accountUuid}`

const generateOnboardingLink = (accountUuid: string, country?: string) => (
  `/v1/payments/onboarding/${accountUuid}${country ? `?country=${country}` : ''}`
)

export {
  generateConnectDashboardLink,
  generateOnboardingLink,
}
