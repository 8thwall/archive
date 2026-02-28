import {IStat} from './topline-stats'
import {ICaseStudyCarouselItemData} from './case-study-carousel'

export interface IMetaData {
  titleTag: string,
  metaDescription: string,
  metaImage: string,
}

export interface IAward {
  src: string,
  alt: string,
}

export interface IHero {
  img: string,
  h1: string,
  awards: IAward[]
}

export interface IProjectOverview {
  paragraph: string,
  stats: IStat[],
  blockQuote: string,
  citation: string,
}

export interface IExperience {
  paragraph: string,
  videoOrientation: 'vertical' | 'horizontal',
  video: string,
  videoSize?: number,
  isGif?: boolean,
}

export interface IResults {
  paragraph: string,
  awards: IAward[],
  tags: string[],
}

export interface IStudioLogo {
  img: string,
  alt: string,
  scale?: string,
}

export interface IAbout {
  paragraph: string,
  studioLogo: IStudioLogo,
  studioName: string,
  profilePage?: string,
}

export interface ICaseStudyData {
  metaData: IMetaData
  hero: IHero,
  projectOverview: IProjectOverview,
  experience: IExperience,
  results: IResults,
  about: IAbout,
  carousel: ICaseStudyCarouselItemData[],
}

export interface ICaseStudy {
  caseStudyData: ICaseStudyData,
}
