import React from 'react'
import Carousel, {consts} from 'react-elastic-carousel'
import {useTranslation} from 'gatsby-plugin-react-i18next'
import {Link} from 'gatsby'

import * as classes from './industry-carousel.module.scss'

const Industries = [
  {
    name: 'industry_section.industry_name.entertainment',
    url: 'entertainment',
    industryId: 'entertainment_2ppvg7btvcx99tmsy3xreqhwqdql3h75cdm9m1umygwgpevs89aj4mr7',
    priority: 1,
  },
  {
    name: 'industry_section.industry_name.automotive',
    url: 'automotive',
    industryId: 'automotive_4s4ewom791blnus6ih616oq2fkjxtb9hdp8f0sc9vm4tgj7rxk43pwdu',
    priority: 6,
  },
  {
    name: 'industry_section.industry_name.business',
    url: 'business',
    industryId: 'business_2q29xfspsrffjywdd1kajc94s62mug2xwa1i25hqq977dac5mw5nibsk',
    priority: 11,
  },
  {
    name: 'industry_section.industry_name.cpg_fmcg',
    url: 'cpg-fmcg',
    industryId: 'cpg_4vn3dpatq2czovqq8ep9f9rnk4k97jtpuvs9w6neczei29yy8picf3he',
    priority: 4,
  },
  {
    name: 'industry_section.industry_name.food_and_beverage',
    url: 'food-beverage',
    industryId: 'foodAndBeverage_2kqtyd8273ysqfwxjl7y7m0wlqqismqx8x9j7n8k3g4pdaw1dn3d20qg',
    priority: 2,
  },
  {
    name: 'industry_section.industry_name.fashion',
    url: 'fashion',
    industryId: 'fashion_4z6axdk5eocixvuhzhqj86i4ql947v8cqjkblib8pj0lx0p9vgy9cwv5',
    priority: 3,
  },
  {
    name: 'industry_section.industry_name.arts_and_culture',
    url: 'arts-culture',
    industryId: 'artsAndCulture_4xe2ul7j8uwriplyuigi3lhwezv43r5v5ejaxikg4v3nph0j2r5vpr39',
    priority: 10,
  },
  {
    name: 'industry_section.industry_name.beauty_and_wellness',
    url: 'beauty-wellness',
    industryId: 'beautyAndWellness_2tb1jymlo7bg5pgjoq2bwjd918clu399foh16fqb5ovmrsik7rl20bw9',
    priority: 8,
  },
  {
    name: 'industry_section.industry_name.education',
    education: 'education',
    industryId: 'education_2prbq4ngx5o9uioqqwse65y97k7pv8n96wrgb4xkm1t8tl9cicm6imp2',
    priority: 12,
  },
  {
    name: 'industry_section.industry_name.music',
    url: 'music',
    industryId: 'music_4vyjhad3gyh8ybv19op242puki22fueubcaofzoak2zbqkvvf3i2t0z7',
    priority: 7,
  },
  {
    name: 'industry_section.industry_name.game_and_toys',
    url: 'games-toys',
    industryId: 'gamesAndToys_4z627tcim99oldhbuj5ox4wh7qyvvbjr41ug0hznesd1aflym3xkw1nl',
    priority: 5,
  },
  {
    name: 'industry_section.industry_name.finance',
    url: 'finance',
    industryId: 'finance_2ta1o40qvi31khy6qhwhqqosr9p02qhv2xwxsddpkdcb2wy4mc0kg8jc',
    priority: 13,
  },
  {
    name: 'industry_section.industry_name.sports',
    url: 'sports',
    industryId: 'sports_2pqknn2v2dmwjirpru8fq7p7lwrzx7frs1s9wkv8ur95trky7jl8t752',
    priority: 9,
  },
]

type Keyword = {
  name: string
  url?: string
  industryId: string
  priority: number
}

interface IIndustry {
  keyword: Keyword
}

const IndustryCard = ({keyword}: IIndustry) => {
  const {t} = useTranslation(['404-page'])
  const {name, industryId} = keyword

  const keywordPath = keyword.url?.toLocaleLowerCase()
  const linkTo = `/discover/${keywordPath}`
  const imgUrl = `https://cdn.8thwall.com/images/discovery/industry/${industryId}-500x280`

  return (
    <div className={classes.industryCard}>
      <Link
        to={linkTo}
        a8={`click;discover;click-industry-carousel-${keywordPath}`}
      >
        <img
          alt={t(name)}
          draggable={false}
          src={imgUrl}
        />
        <div>{t(name)}</div>
      </Link>
    </div>
  )
}

const IndustryCarousel = () => {
  const renderArrow = ({type, onClick, isEdge}) => (
    <button
      type='button'
      onClick={onClick}
      disabled={isEdge}
      className={classes.arrowButton}
    >
      <span className={classes.visuallyHidden}>{type === 'PREV' ? 'Previous' : 'Next'}</span>
      <i className={type === consts.PREV ? 'fas fa-chevron-left'
        : 'fas fa-chevron-right'}
      />
    </button>
  )

  const cards = Industries
    .sort((a, b) => (a.priority < b.priority ? -1 : 1))
    .map((keyword) => (<IndustryCard keyword={keyword} key={keyword.name} />))

  return (
    <>
      <div className={classes.carouselContainer}>
        <Carousel
          className={classes.industryCarousel}
          renderArrow={renderArrow}
          pagination={false}
          itemsToShow={3.5}
          itemsToScroll={1}
          itemPadding={[12, 12]}
        >
          {cards}
        </Carousel>
      </div>
      <div className={classes.carouselContainerSmall}>
        {cards}
      </div>
    </>
  )
}

export default IndustryCarousel
