const STAGING_PASSPHRASE_REGEX_PATTERN = '[a-zA-Z0-9 ]{5,127}'

const isValidPassphrase = (passphrase: string) => /^[a-zA-Z0-9 ]{5,127}$/.test(passphrase)

export {
  STAGING_PASSPHRASE_REGEX_PATTERN,
  isValidPassphrase,
}
