// Note(Brandon): This function is based on the Promenade's normalizeEmail function provided below.
// eslint-disable-next-line max-len
// https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/niantic/promenade/-/blob/master/core/platform-base/src/main/java/com/nianticproject/platform/common/EmailUtils.java

/**
* Return a normalized version of an email address. Strip out any known ignored punctuation, and
* reconcile known alternate domains (e.g. gmail vs googlemail).
*/
const normalizeEmail = (email: string): string => {
  const GMAIL_SUFFIX = '@gmail.com'
  const GMAIL_SUFFIX_ALTERNATE = '@googlemail.com'
  const lowerCasedEmail = email.toLowerCase()
  let gmailSuffix: string | null = null

  if (lowerCasedEmail.endsWith(GMAIL_SUFFIX)) {
    gmailSuffix = GMAIL_SUFFIX
  }

  if (lowerCasedEmail.endsWith(GMAIL_SUFFIX_ALTERNATE)) {
    gmailSuffix = GMAIL_SUFFIX_ALTERNATE
  }

  if (gmailSuffix !== null) {
    const usernameWithAlias = lowerCasedEmail.substring(0, lowerCasedEmail.indexOf(gmailSuffix))
    const usernameWithNoDots = usernameWithAlias.replace(/\./g, '')
    const indexOfAlias = usernameWithNoDots.indexOf('+')
    const username = indexOfAlias !== -1
      ? usernameWithNoDots.substring(0, indexOfAlias)
      : usernameWithNoDots
    return username + GMAIL_SUFFIX
  }

  return lowerCasedEmail
}

/**
 * Checks to see if an email is valid by only allowing a certain format to pass through.
 * This helps to prevent fake emails or possible usage of non-email related strings.
 */
const validateEmailFormat = (email: string): boolean => {
  const emailPattern = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  return emailPattern.test(email)
}

export {
  normalizeEmail,
  validateEmailFormat,
}
