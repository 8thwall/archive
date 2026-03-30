#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'

import {AssetConverterStack} from '../lib/asset-converter-stack'

const app = new cdk.App()
const region = 'us-west-2'
const XRHOME_DEV_ROLE_NAME = 'xrhome-iam-dev-iamrole10180D71-1J01DNYIU1WXB'
const XRHOME_PROD_ROLE_NAME = 'xrhome-iam-prod-iamrole10180D71-1KW31LTXLG64M'

const getStackProps = (dataRealm: 'qa' | 'prod') => ({
  stackName: `asset-converter-${dataRealm}`,
  terminationProtection: true,
  env: {region},
  description: `Service to convert assets for Niantic Studio (${dataRealm})`,
  dataRealm,
  xrhomeRoleName: dataRealm === 'qa' ? XRHOME_DEV_ROLE_NAME : XRHOME_PROD_ROLE_NAME,
})

// Dev stack.
new AssetConverterStack(app, 'asset-converter-qa', getStackProps('qa'))

// Prod stack.
new AssetConverterStack(app, 'asset-converter-prod', getStackProps('prod'))
