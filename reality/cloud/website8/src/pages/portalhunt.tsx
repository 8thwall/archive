import React from 'react'
import {css} from '@emotion/react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'gatsby-plugin-react-i18next'
import {graphql} from 'gatsby'

import {TwitterTweetEmbed} from 'react-twitter-embed'

import Layout from '../components/layouts/layout'

import portalHuntHeaderImg from '../../img/portalhunt-header.jpg'
import auggieImg from '../../img/auggie.svg'
import apolloVideo from '../../img/portalvid/apolloloop.mp4'
import sputnikVideo from '../../img/portalvid/sputnikloop.mp4'
import swarmVideo from '../../img/portalvid/swarmloop.mp4'
import logbookVideo from '../../img/portalvid/logbookloop.mp4'
import leaderBoardVideo from '../../img/portalvid/leaderboard.mp4'
import player1Img from '../../img/portalvid/player-1.jpg'
import player2Img from '../../img/portalvid/player-2.jpg'
import player3Img from '../../img/portalvid/player-3.jpg'
import curiosityImg from '../../img/portals-img/curiosity.jpg'
import geminiAImg from '../../img/portals-img/gemini-a.jpg'
import geminiBImg from '../../img/portals-img/gemini-b.jpg'
import osirisImg from '../../img/portals-img/osiris.jpg'
import sputnikImg from '../../img/portals-img/sputnik.jpg'
import apolloImg from '../../img/portals-img/apollo.jpg'
import athenaImg from '../../img/portals-img/athena.jpg'
import cassiniImg from '../../img/portals-img/cassini.jpg'
import hayabusaImg from '../../img/portals-img/hayabusa.jpg'
import pioneerImg from '../../img/portals-img/pioneer.jpg'
import voyagerImg from '../../img/portals-img/voyager.jpg'

const useStyles = createUseStyles({
  dark: {
    'backgroundColor': 'black',
    '& .embed8-link-icon': {
      minWidth: '3.5em',
      margin: '0px',
    },

    '& .embed8-pop-over': {
      left: '50% !important',
    },

    '& .embed8-pop-over::after': {
      left: '50% !important',
    },

    '& .embed8-pop-over-right': {
      width: '50%',
    },

    '& .carousel-control-next-icon': {
      borderColor: 'transparent transparent transparent #ff6700',
    },

    '& .carousel-control-prev-icon': {
      borderColor: 'transparent #ff6700 transparent transparent',
    },

    '& .twitter-tweet': {
      margin: '0 auto',
    },

    '& #listbox p': {
      color: 'white',
    },

    '& #dropdown-icon': {
      color: 'white',
    },
  },
})

export default () => {
  const {t} = useTranslation(['portalhunt-page'])
  const classes = useStyles()
  return (
    <Layout title={t('page.title')} className={classes.dark}>
      <header>
        <div className='container-fluid'>
          <div className='row justify-content-center'>
            <img src={portalHuntHeaderImg} id='portalBG' />
          </div>
          <div className='row justify-content-center'>
            <img src={auggieImg} id='auggie' />
          </div>
        </div>
      </header>

      {/* <!--  Overview  --> */}
      <section className='portal'>
        <div className='row justify-content-center portal-section'>
          <div className='col-lg-7 col-sm-12'>
            <p>{t('portal_section.description.introduction')}</p>
          </div>
        </div>

        <div className='row text-center portal-section triple-vid'>
          <div className='col-lg-4 col-sm-12'>
            <video autoPlay loop muted playsInline src={apolloVideo} />
          </div>

          <div className='col-lg-4 col-sm-12'>
            <video autoPlay loop muted playsInline src={sputnikVideo} />
          </div>

          <div className='col-lg-4 col-sm-12'>
            <video autoPlay loop muted playsInline src={swarmVideo} />
          </div>

        </div>

        <div className='row justify-content-center portal-section'>

          <div className='col-lg-7 col-sm-12'>

            <p>{t('portal_section.description.logbook_leaderboard')}</p>

          </div>

        </div>

        <div className='row text-center portal-section triple-vid'>

          <div className='col-lg-6 col-sm-12'>
            <video autoPlay loop muted playsInline src={logbookVideo} />
          </div>

          <div className='col-lg-6 col-sm-12'>
            <video autoPlay loop muted playsInline src={leaderBoardVideo} />
          </div>

        </div>

        <div className='row justify-content-center portal-section'>

          <div className='col-lg-7 col-sm-12'>

            <p>{t('portal_section.description.stats')}</p>

          </div>

        </div>

        <div
          className='row justify-content-center portal-section'
          css={css`max-width: 40em; margin: 0 auto; margin-top: 6em;`}
        >

          <div className='col-12'>
            <h2>{t('portal_section.heading.stats')}</h2>
          </div>

          <div className='col-6 portal-stat'>
            <h4>{t('portal_section.stats.name.portals_opened')}</h4>
            <h4>3779</h4>
          </div>

          <div className='col-6 portal-stat'>
            <h4>{t('portal_section.stats.name.uniques')}</h4>
            <h4>1336</h4>
          </div>

          <div className='col-6 portal-stat'>
            <h4>{t('portal_section.stats.name.time_spent')}</h4>
            <h4>{t('portal_section.stats.value.time_spent')}</h4>
          </div>

          <div className='col-6 portal-stat'>
            <h4>{t('portal_section.stats.name.certified_explorers')}</h4>
            <h4>82</h4>
          </div>

        </div>

        <div className='row justify-content-center portal-section'>

          <div className='col-lg-7 col-sm-12'>

            <p>{t('portal_section.description.engagement')}</p>

          </div>

        </div>

        <div className='row text-center portal-section triple-pic'>

          <div className='col-lg-4 col-sm-12'>
            <img src={player1Img} />
          </div>

          <div className='col-lg-4 col-sm-12'>
            <img src={player2Img} />
          </div>

          <div className='col-lg-4 col-sm-12'>
            <img src={player3Img} />
          </div>

        </div>

        <div className='row justify-content-center portal-section tweet-quote'>

          <div className='col-lg-6 col-sm-12'>
            <TwitterTweetEmbed
              tweetId='1134178003376717824'
              options={{
                cards: 'hidden',
                conversation: 'none',
              }}
            />
          </div>

          {/* https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/guides/embedded-tweet-parameter-reference */}
          <div className='col-lg-6 col-sm-12'>
            <TwitterTweetEmbed
              tweetId='1133898237125906432'
              options={{
                cards: 'hidden',
                conversation: 'none',
              }}
            />
          </div>
        </div>

        <div className='row justify-content-center tweet-quote'>
          <div className='col-lg-6 col-sm-12'>
            <TwitterTweetEmbed tweetId='1133853823234072576' />
          </div>

          <div className='col-lg-6 col-sm-12'>
            <TwitterTweetEmbed tweetId='1134171385838747648' />
          </div>

        </div>

        <div className='row justify-content-center portal-section'>

          <div className='col-lg-7 col-sm-12'>

            <p>{t('portal_section.description.vindication')}</p>

          </div>

        </div>
      </section>
      {/* <!-- END: Features--> */}

      {/* <!--  What this means for brands    --> */}
      <section className='container-fluid portal' css={css`margin-bottom: 10em;`}>

        <div className='row justify-content-center'>
          <div className='col-12 justify-content-center'>

            <div
              className='carousel slide'
              id='carouselControls'
              data-ride='carousel'
              data-interval='false'
              css={css`margin: 0 auto; width: 70%; height: 100%; text-align: center`}
            >

              <div className='carousel-inner' css={css`min-height: 65em;`}>

                <div className='carousel-item active'>
                  <div className='row justify-content-around portal-slide'>

                    <div className='col-12'>

                      <img
                        src={curiosityImg}
                        className='portal-target img-fluid img-responsive'
                      />

                      <div className='row' css={css`max-width: 20em; margin: 0 auto; margin-top: 3em;`}>
                        <div className='col-12 text-center' css={css`margin-top: 1em;`}>
                          <h2>Curiosity</h2>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>

                <div className='carousel-item'>
                  <div className='row justify-content-around portal-slide'>
                    <div className='col-6'>

                      <img
                        src={geminiAImg}
                        className='portal-target img-fluid img-responsive'
                      />
                    </div>

                    <div className='col-6'>

                      <img
                        src={geminiBImg}
                        className='portal-target img-fluid img-responsive'
                      />

                    </div>

                    <div className='row' css={css`max-width: 20em; margin: 0 auto; margin-top: 3em;`}>
                      <div className='col-12 text-center' css={css`margin-top: 1em;`}>
                        <h2>Gemini</h2>
                        <p>{t('brand_section.carousel.item.blurb.gemini')}</p>
                      </div>
                    </div>

                  </div>
                </div>

                <div className='carousel-item'>
                  <div className='row justify-content-around portal-slide'>

                    <div className='col-12'>

                      <img
                        src={osirisImg}
                        className='portal-target img-fluid img-responsive'
                      />

                      <div className='row' css={css`max-width: 20em; margin: 0 auto; margin-top: 3em;`}>
                        <div className='col-12 text-center' css={css`margin-top: 1em;`}>
                          <h2>O siris</h2>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>

                <div className='carousel-item'>
                  <div className='row justify-content-around portal-slide'>

                    <div className='col-12'>

                      <img
                        src={sputnikImg}
                        className='portal-target img-fluid img-responsive'
                      />

                      <div className='row' css={css`max-width: 20em; margin: 0 auto; margin-top: 3em;`}>
                        <div className='col-12 text-center' css={css`margin-top: 1em;`}>
                          <h2>Sputnik</h2>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>

                <div className='carousel-item'>
                  <div className='row justify-content-around portal-slide'>

                    <div className='col-12'>

                      <img
                        src={apolloImg}
                        className='portal-target img-fluid img-responsive'
                      />

                      <div className='row' css={css`max-width: 20em; margin: 0 auto; margin-top: 3em;`}>
                        <div className='col-12 text-center' css={css`margin-top: 1em;`}>
                          <h2>Apollo</h2>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>

                <div className='carousel-item'>
                  <div className='row justify-content-around portal-slide'>

                    <div className='col-12'>

                      <img
                        src={athenaImg}
                        css={css`width: 100%; max-height: 100%`}
                        className='portal-target img-fluid img-responsive'
                      />

                      <div className='row' css={css`max-width: 20em; margin: 0 auto; margin-top: 3em;`}>
                        <div className='col-12 text-center' css={css`margin-top: 1em;`}>
                          <h2>Athena</h2>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>

                <div className='carousel-item'>
                  <div className='row justify-content-around portal-slide'>

                    <div className='col-12'>

                      <img
                        src={cassiniImg}
                        className='portal-target img-fluid img-responsive'
                      />

                      <div className='row' css={css`max-width: 20em; margin: 0 auto; margin-top: 3em;`}>
                        <div className='col-12 text-center' css={css`margin-top: 1em;`}>
                          <h2>Cassini</h2>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>

                <div className='carousel-item'>
                  <div className='row justify-content-around portal-slide'>

                    <div className='col-12'>

                      <img
                        src={hayabusaImg}
                        className='portal-target img-fluid img-responsive'
                      />

                      <div className='row' css={css`max-width: 20em; margin: 0 auto; margin-top: 3em;`}>
                        <div className='col-12 text-center' css={css`margin-top: 1em;`}>
                          <h2>Hayabusa</h2>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>

                <div className='carousel-item'>
                  <div className='row justify-content-around portal-slide'>

                    <div className='col-12'>

                      <img
                        src={pioneerImg}
                        className='portal-target img-fluid img-responsive'
                      />

                      <div className='row' css={css`max-width: 20em; margin: 0 auto; margin-top: 3em;`}>
                        <div className='col-12 text-center' css={css`margin-top: 1em;`}>
                          <h2>Pioneer</h2>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>

                <div className='carousel-item'>
                  <div className='row justify-content-around portal-slide'>

                    <div className='col-12'>

                      <img
                        src={voyagerImg}
                        className='portal-target img-fluid img-responsive'
                      />

                      <div className='row' css={css`max-width: 20em; margin: 0 auto; margin-top: 3em;`}>
                        <div className='col-12 text-center' css={css`margin-top: 1em;`}>
                          <h2>Voyager</h2>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
              <a className='carousel-control-prev' href='#carouselControls' role='button' data-slide='prev'>
                <span className='carousel-control-prev-icon' aria-hidden='true' />
                <span className='sr-only'>{t('brand_section.carousel.control.previous')}</span>
              </a>
              <a className='carousel-control-next' href='#carouselControls' role='button' data-slide='next'>
                <span className='carousel-control-next-icon' aria-hidden='true' />
                <span className='sr-only'>{t('brand_section.carousel.control.next')}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* <!--  END: What this means for brands    --> */}
    </Layout>
  )
}

export const query = graphql`
  query {
    locales: allLocale {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`
