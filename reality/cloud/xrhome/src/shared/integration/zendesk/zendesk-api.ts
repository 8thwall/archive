import type {Requests, Tickets, Attachments} from 'node-zendesk'
import type {PathLike} from 'fs'

import {entry} from '../../registry'

enum ZendeskClientType {
  EIGHTH_WALL,
  LIGHTSHIP,
}

interface IZendeskClient {
  createTicket: (payload: Tickets.CreatePayload) => Promise<Tickets.ResponsePayload>
  updateTicket: (
    ticketId: number, payload: Tickets.UpdatePayload
  ) => Promise<Tickets.ResponsePayload>
  createRequest: (payload: Requests.CreatePayload) => Promise<Requests.ResponsePayload>
  uploadAttachment: (
    file: PathLike, fileOptions: {filename: string, binary?: boolean}
  ) => Promise<Attachments.UploadResponseModel>
}
interface IZendesk {
  getClient: (type: ZendeskClientType) => Promise<IZendeskClient>
}

const Zendesk = entry<IZendesk>('zendesk')

export {Zendesk, ZendeskClientType}

export type {IZendesk, IZendeskClient}
