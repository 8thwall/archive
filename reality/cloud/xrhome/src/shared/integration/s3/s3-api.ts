import type {S3 as IS3} from 'aws-sdk'

import {entry} from '../../registry'

const S3 = entry<IS3>('s3')

export {S3}
