/* eslint-disable camelcase */
interface IPost {
  id: number
  title: string
  slug: string
  summary: string
  created: number
  featuredImage: string
  subtitle: string
  author: number
  publishDate: number
  body: string
  topics: Array<number>
  readTime: number
}

interface ITopic {
  id: number
  slug: string
  name: string
}

interface IAuthor {
  id: number
  userId: number
  avatar: string
  email: string
  fullName: string
  gravatarUrl: string
  slug: string
  bio: string
}

// eslint-disable-next-line no-undef
export {IPost, ITopic, IAuthor}
/* eslint-enable camelcase */
