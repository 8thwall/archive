const forkableLicenses = ['MIT']

const licenseIsForkable = (licenseType: string) => forkableLicenses.includes(licenseType)

export {
  licenseIsForkable,
}
