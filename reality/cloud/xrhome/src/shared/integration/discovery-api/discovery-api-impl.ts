import {SQSClient, SendMessageCommand} from '@aws-sdk/client-sqs'

import type {IDiscoveryApi} from './discovery-api'

const DEFAULT_MODIFY_SEARCH_QUEUE =
// eslint-disable-next-line max-len
  'https://sqs.us-west-2.amazonaws.com/<REMOVED_BEFORE_OPEN_SOURCING>/discovery-hub-dev-modify-search'

const createDiscoveryApi = (
  sqsClient: SQSClient, queueUrl: string = DEFAULT_MODIFY_SEARCH_QUEUE
): IDiscoveryApi => {
  const makeMessageAttributes = (messageType: string) => ({
    messageType: {
      DataType: 'String',
      StringValue: messageType,
    },
  })

  const sendSqsMessage = async (
    messageType: string, payload: object, delaySeconds: number = 0
  ) => {
    const command = new SendMessageCommand({
      MessageAttributes: makeMessageAttributes(messageType),
      MessageBody: JSON.stringify(payload),
      QueueUrl: queueUrl,
      DelaySeconds: delaySeconds,
    })

    try {
      await sqsClient.send(command)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
  }

  const sendDiscoveryManageDocTask = async (action: string, indexName: string, uuid: string) => {
    const messageType = action.toUpperCase()
    const payload = {
      action,
      indexName,
      id: uuid,
    }

    await sendSqsMessage(messageType, payload)
  }

  return {
    sendDiscoveryManageDocTask,
  }
}

export {
  createDiscoveryApi,
}
