import React from 'react'
import {useLocation} from '@reach/router'

import {
  getCurrentUser,
  getAttributes,
  updateAttributes,
  patchNewsletterContact,
  logOut,
  isEligibleForFreeTrial,
} from '../../common/user'
import type {User, UserAttributes} from '../../common/user-config'
import Header from './header'
import Footer from './footer'
import SiteMetadata from '../site-metadata'
import {combine} from '../../styles/classname-utils'
import {UserContextProvider, IUserContext} from '../../common/user-context'

const Layout = ({
  title,
  description = '',
  usePrefix = true,
  children,
  className = '',
  fromNotFoundPage = false,
  metaImage = '',
  isHomePage = false,
  showHeader = true,
  showFooter = true,
  ...rest
}) => {
  const {pathname} = useLocation()
  const [currentUser, setCurrentUser] = React.useState<User>()
  const [userAttributes, setUserAttributes] = React.useState<UserAttributes>()
  const [isUserEligibleForFreeTrial, setIsUserEligibleForFreeTrial] = React.useState(true)

  React.useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser()
      setCurrentUser(user)
    }

    fetchUser()
  }, [])

  React.useEffect(() => {
    const fetchAttributes = async () => {
      if (currentUser) {
        const res = await getAttributes(currentUser)
        if (res) {
          const {niantic, user} = res
          if (niantic?.profilePhotoUrl) {
            user.profilePhotoUrl = niantic.profilePhotoUrl
          }
          setUserAttributes(user)
        }

        setIsUserEligibleForFreeTrial(await isEligibleForFreeTrial(currentUser))

        // Enable Google Analytics User-ID feature using user uuid
        window.dataLayer.push({userId: currentUser.userUuid})
      }
    }

    fetchAttributes()
  }, [currentUser])

  React.useEffect(() => {
    if (userAttributes) {
      // Collecting user data with Pendo
      if (window.pendo) {
        const params = {
          visitor: {
            id: userAttributes.uuid,
            email: userAttributes.primaryContactEmail,
            locale: userAttributes.locale,
          },
          account: null,
        }

        if (typeof window.pendo.isReady === 'function' && window.pendo.isReady()) {
          window.pendo.identify(params)
        } else {
          window.pendo.initialize(params)
        }
      }
    }
  }, [userAttributes])

  const signOut = () => {
    if (currentUser) {
      logOut(currentUser)
    }
  }

  // TODO(wayne): Create a new xrhome endpoint for this and request with "keepalive: true"
  // So we can reload the page immediately after locale is selected without an "await"
  // NOTE(wayne): Currently, this is for attribute "locale" only for now,
  // which matches what we have in all Users table, crm, and newsletter.
  // Considering explicitly defining the attributes when introducing more attributes
  const updateUserAttributes = async (attributes) => {
    if (currentUser && userAttributes) {
      try {
        await updateAttributes(attributes, currentUser)

        const {newsletterId} = userAttributes
        if (newsletterId) {
          await patchNewsletterContact(newsletterId, attributes, currentUser)
        }

        setUserAttributes({
          ...userAttributes,
          ...attributes,
        })
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err.message)
      }
    }
  }

  return (
    <UserContextProvider value={{
      currentUser,
      userAttributes,
      updateUserAttributes,
      isUserEligibleForFreeTrial,
      signOut,
    } as IUserContext}
    >
      <SiteMetadata
        pathname={pathname}
        {...(description && {description})}
        title={title}
        usePrefix={usePrefix}
        fromNotFoundPage={fromNotFoundPage}
        metaImage={metaImage}
      />
      <div className={combine('layout', className)} {...rest}>
        {showHeader && <Header isHomePage={isHomePage} />}
        {children}
        {showFooter && <Footer />}
      </div>
    </UserContextProvider>
  )
}

export default Layout
