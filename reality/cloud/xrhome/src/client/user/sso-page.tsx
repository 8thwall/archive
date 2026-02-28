import React, {useState, useEffect} from 'react'
import {Redirect, useLocation} from 'react-router-dom'
import querystring from 'query-string'

import {useSelector} from '../hooks'
import useActions from '../common/use-actions'
import userActions from '../user-niantic/user-niantic-actions'
import {getRootPath} from '../common/paths'
import {Loader} from '../ui/components/loader'
import {TermsOfService} from '../home/terms'
import {MigrateExistingUsersModal} from '../accounts/widgets/migrate-existing-users-modal'

const SsoPage: React.FC = () => {
  const {showToS, showMigrateUser} = useSelector(s => s.common)
  const {loginDiscourse} = useActions(userActions)
  const location = useLocation()

  const parsedQueryString: Record<string, string> = querystring.parse(location.search)
  const {ssoTarget, sso, sig} = parsedQueryString
  const isActingAsSso = !!ssoTarget && !!sso && !!sig
  const [isEligibleForSso, setIsEligibleForSso] = useState(isActingAsSso && !showMigrateUser)

  useEffect(() => {
    if (isEligibleForSso && !showToS) {
      if (ssoTarget === 'discourse') {
        loginDiscourse(sso, sig)
      } else {
        setIsEligibleForSso(false)
      }
    }
  }, [showToS])

  if (!isEligibleForSso) {
    return <Redirect to={getRootPath()} />
  }

  if (showToS) {
    return <TermsOfService />
  }

  if (showMigrateUser) {
    return <MigrateExistingUsersModal />
  }

  return <Loader />
}

export default SsoPage
