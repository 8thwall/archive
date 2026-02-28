/* eslint-disable camelcase */
import type {RequestPromise} from 'request-promise'

import {entry} from '../../registry'

type NumberLike = number | string

interface IPostOpts {
  limit?: NumberLike
  offset?: NumberLike
  archived?: boolean
  blog_author_id?: number
  campaign?: string
  content_group_id?: string
  topic_id?: NumberLike
  created?: any
  deleted_at?: any
  name?: string
  slug?: string
  updated?: any
  state?: any
  order_by?: any
  created_lte?: number
}

interface IAuthorResponse {
  id: number
  user_id: number
  avatar: string
  email: string
  full_name: string
  gravatar_url: string
  slug: string
  bio: string
}

interface ITopicResponse {
  id: number
  name: string
  slug: string
  description: string
  created: number
  updated: number
}

interface IPostResponse {
  id: number
  title: string
  slug: string
  post_summary: string
  post_body: string
  topic_ids: Array<number>
  created: number
  featured_image: string
  author_user_id: number
  publish_date: number
  blog_author: IAuthorResponse
  meta_description: string
}

interface ITopicOpts {
  id?: NumberLike
  id__in?: any
  name?: string
  name__contains?: string
  name__icontains?: string
  slug?: string
  created?: any
  limit?: NumberLike
  offset?: NumberLike
}

interface IHubspotBlogApi {
  posts: {
    list: (opts: IPostOpts) => RequestPromise
    get: (id: NumberLike) => RequestPromise
  }
  topics: {
    list: (opts: ITopicOpts) => RequestPromise
    get: (id: NumberLike) => RequestPromise
  }
}

const HubspotBlogApi = entry<IHubspotBlogApi>('hubspot-blog-api')

export {HubspotBlogApi}

export type {
  ITopicResponse, IAuthorResponse, IPostResponse, IHubspotBlogApi, IPostOpts,
}
