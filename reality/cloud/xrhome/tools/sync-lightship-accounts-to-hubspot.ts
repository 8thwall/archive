import {Hubspot} from '../src/shared/integration/hubspot/hubspot-api'
import {Firebase} from '../src/shared/integration/firebase/firebase'
import {createFirebase} from '../src/shared/integration/firebase/firebase-impl'
import {
  createSecretsProvider,
} from '../src/shared/integration/secrets-provider/secrets-provider-impl'
import {createAccessTokenHubspot} from '../src/shared/integration/hubspot/hubspot-api-impl'
import {SecretsProvider} from '../src/shared/integration/secrets-provider/secrets-provider-api'
import {
  THIRD_PARTY_SCOPE, registerLightshipScope, registerThirdPartyScope,
} from '../src/server/secret-scopes'
import {convertObjToPropList} from '../src/server/integration/hubspot'

const BATCH_LIMIT = 1000
const ENV = 'dev'

const syncLightshipAccountsDataToHubspot = async () => {
  let devProfiles = {docs: []}
  do {
    const [lastVisible] = devProfiles.docs.slice(-1)
    /* eslint-disable no-await-in-loop */
    devProfiles = await Firebase.use().getDeveloperProfiles({
      startAfter: lastVisible?.data()?.createTime,
      limit: BATCH_LIMIT,
    })
    if (!devProfiles?.docs?.length) {
      return
    }
    let recordBatch = devProfiles.docs.map((doc) => {
      const data = doc.data()
      return {
        email: data.email,
        properties: convertObjToPropList({
          lightship_name: data.name,
          lightship_country: data?.country || data.registrationData?.country || '',
          has_lightship_account: 'true',
        }),
      }
    })
    let retries = 3
    while (retries > 0) {
      try {
        await Hubspot.use().contacts.createOrUpdateBatch(recordBatch)
        retries = 0
      } catch (e) {
        if (!e?.error?.invalidEmails?.length) {
          // eslint-disable-next-line no-console
          console.error(
            'failed to sync lightship account from last checkpoint: ', lastVisible?.data()
          )
          throw e
        }
        // eslint-disable-next-line no-console
        console.log('list of failed emails in batch: ', e.error.invalidEmails)
        recordBatch = recordBatch.filter(r => !e.error.invalidEmails.includes(r.email))
        retries -= 1
      }
    }
    /* eslint-enable no-await-in-loop */
  } while (devProfiles.docs.length >= BATCH_LIMIT)
}

const run = async () => {
  try {
    process.env.AWS_REGION = 'us-west-2'
    SecretsProvider.register(createSecretsProvider({
      dataRealm: ENV, deploymentStage: ENV,
    }))
    registerThirdPartyScope()
    registerLightshipScope()
    await SecretsProvider.use().getScope(THIRD_PARTY_SCOPE)
    await Promise.all([
      Hubspot.register(createAccessTokenHubspot()),
      Firebase.register(createFirebase()),
    ])
    await syncLightshipAccountsDataToHubspot()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to sync HubSpot customer state with error: ', e)
  }
}

run()
