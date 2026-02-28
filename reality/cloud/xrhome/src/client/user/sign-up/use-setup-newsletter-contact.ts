import {useTranslation} from 'react-i18next'

import useActions from '../../common/use-actions'
import userActions from '../user-actions'
import type {UserState} from '../user-reducer'

type ContactUser = Pick<UserState, 'email' | 'given_name' | 'family_name'>

const useSetupNewsletterContact = () => {
  const {i18n} = useTranslation(['common'])
  const {createNewsletterContact, patchNewsletterContact, updateAttribute} = useActions(userActions)

  const sessionDataNewsletterContactId = (
    sessionStorage.getItem('free-trial.newsletter-contact-id')
  )

  // If contact id exists in sessionStorage, use PATCH instead
  const setupNewsletterContact = async (user: ContactUser) => {
    let newsletterContact
    if (sessionDataNewsletterContactId) {
      newsletterContact = await patchNewsletterContact(sessionDataNewsletterContactId, {
        email: user.email,
        firstName: user.given_name,
        lastName: user.family_name,
        locale: i18n.language,
      })
      sessionStorage.removeItem('free-trial.newsletter-contact-id')
    } else {
      newsletterContact = await createNewsletterContact({
        email: user.email,
        status: 'subscribed',
        firstName: user.given_name,
        lastName: user.family_name,
        locale: i18n.language,
      })
    }
    await updateAttribute({'custom:newsletterId': newsletterContact.id})
  }

  return {
    setupNewsletterContact,
  }
}

export {
  useSetupNewsletterContact,
}
