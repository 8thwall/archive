// TODO(wayne): This is for identity test only. Remove this when fully migrated to Niantic identity
import React from 'react'
import {graphql} from 'gatsby'
import localforage from 'localforage'

import {
  getCurrentUser,
  getAttributes,
  updateAttributes,
  patchNewsletterContact,
  logOut,
  isEligibleForFreeTrial,
} from '../common/user'
import {User, CACHED_REFRESH_TIME_KEY} from '../common/user-config'
import Header from '../components/layouts/header'
import Footer from '../components/layouts/footer'
import SiteMetadata from '../components/site-metadata'
import {UserContextProvider, IUserContext} from '../common/user-context'

const TestButton = ({name, onClick}) => (
  <button
    type='button'
    onClick={onClick}
  >{name}
  </button>
)

export default () => {
  const [currentUser, setCurrentUser] = React.useState<User>()
  const [userAttributes, setUserAttributes] = React.useState()
  const [isUserEligibleForFreeTrial, setIsUserEligibleForFreeTrial] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      const user = await getCurrentUser()
      setCurrentUser(user)
      // eslint-disable-next-line no-console
      console.log('user:', user)
    }

    fetchData()
  }, [])

  const testGetAttributes = async () => {
    if (currentUser) {
      const res = await getAttributes(currentUser)
      const {user} = res
      // NOTE(wayne): Fixed profile photo URL for test only
      user.profilePhotoUrl =
        'https://www.gravatar.com/avatar/53ceed0db5c0ae2686ac3b84ab324559?d=retro&r=g&s=100'
      setUserAttributes(res.user)
      // eslint-disable-next-line no-console
      console.log('res:', res)
    }
  }

  const testUpdateAttributes = async (attributes) => {
    if (currentUser) {
      const res = await updateAttributes(attributes, currentUser)
      // eslint-disable-next-line no-console
      console.log('res:', res)
    }
  }

  // NOTE(wayne): Need to run testGetAttributes()/testUpdateAttributes() first to get newsletterId
  const testPatchNewsletterContact = async (attributes) => {
    if (userAttributes?.newsletterId) {
      const res =
      await patchNewsletterContact(userAttributes.newsletterId, attributes, currentUser)
      // eslint-disable-next-line no-console
      console.log('res:', res)
    }
  }

  const testIsEligibleForFreeTrial = async () => {
    if (currentUser) {
      const eligibleForFreeTrial = await isEligibleForFreeTrial(currentUser)
      setIsUserEligibleForFreeTrial(eligibleForFreeTrial)
      // eslint-disable-next-line no-console
      console.log('eligibleForFreeTrial:', eligibleForFreeTrial)
    }
  }

  const testSignOut = () => {
    logOut(currentUser)
  }

  const setPastRefreshTime = async () => {
    const pastTime = Date.now() - 1
    await localforage.setItem(CACHED_REFRESH_TIME_KEY, pastTime)

    // We need to update currentUser with the new refreshTime as well
    const user = await getCurrentUser()
    setCurrentUser(user)

    // eslint-disable-next-line no-console
    console.log('New refresh time: ', pastTime, new Date(pastTime).toLocaleString())
  }

  return (
    <UserContextProvider value={{
      currentUser,
      userAttributes,
      updateUserAttributes: testUpdateAttributes,
      isUserEligibleForFreeTrial,
      signOut: testSignOut,
    } as IUserContext}
    >
      <SiteMetadata
        pathname='identity-test'
        description='identity-test'
        title='identity-test'
        usePrefix
        fromNotFoundPage={false}
        metaImage={null}
      />
      <div className='layout'>
        <Header isHomePage={false} />
        <div>
          <div>
            <TestButton name='Test Get Attributes' onClick={testGetAttributes} />
            <TestButton
              name='Test Update Attributes'
              onClick={() => testUpdateAttributes({locale: 'ja-JP'})}
            />
            <TestButton
              name='Test Patch Newsletter Contact'
              onClick={() => testPatchNewsletterContact({locale: 'ja-JP'})}
            />
            <TestButton name='Test Eligible For Free Trial' onClick={testIsEligibleForFreeTrial} />
            <TestButton name='Test Sign Out' onClick={testSignOut} />
          </div>
          <TestButton name='Set Past Refresh Time' onClick={setPastRefreshTime} />
        </div>
        <Footer />
      </div>
    </UserContextProvider>
  )
}

export const query = graphql`
  query {
    locales: allLocale {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`
