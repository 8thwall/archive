import React from 'react'
import {Link} from 'gatsby'
import {css} from '@emotion/react'
import {useTranslation} from 'gatsby-plugin-react-i18next'

import rocketIcon from '../../../img/rocketIcon.png'
import {combine} from '../../styles/classname-utils'
import * as classes from './header.module.scss'

const LoggedOutNavbar = () => {
  const {t} = useTranslation(['navigation'])
  const PRODUCTS_PATH = 'products'

  return (
    <>
      <li className='nav-item'>
        <div
          className={combine(
            'dropdown',
            classes.navbarDropdownHeader
          )}
        >
          <div
            className={combine(classes.dropMenu, classes.navLink)}
            data-toggle='dropdown'
            aria-haspopup='true'
            aria-expanded='false'
            a8='click;navigation;expand-products'
          >
            {t('footer.link.product')}&nbsp;
            <i className={combine(
              'fas fa-angle-down',
              classes.navbarDropdownText
            )}
            />
          </div>

          <div
            className={combine(
              'dropdown-menu',
              'justify-content-center',
              classes.dropdownMenuContent
            )}
            aria-labelledby='dropMenu'
          >
            <a
              className={combine(classes.dropdownItem, 'dropdown-item')}
              href={`/${PRODUCTS_PATH}/niantic-studio`}
              a8='click;navigation;go-to-products-niantic-studio'
            >{t('header.link.product.niantic_studio')}
            </a>
            <a
              className={combine(classes.dropdownItem, 'dropdown-item')}
              href={`/${PRODUCTS_PATH}/world-ar`}
              a8='click;navigation;go-to-products-world-ar'
            >{t('header.link.product.world_ar')}
            </a>
            <a
              className={combine(classes.dropdownItem, 'dropdown-item')}
              href={`/${PRODUCTS_PATH}/location-ar`}
              a8='click;navigation;go-to-products-location-ar'
            >{t('header.link.product.location_ar')}
            </a>
            <a
              className={combine(classes.dropdownItem, 'dropdown-item')}
              href={`/${PRODUCTS_PATH}/image-targets`}
              a8='click;navigation;go-to-products-image-targets'
            >{t('header.link.product.image_targets')}
            </a>
            <a
              className={combine(classes.dropdownItem, 'dropdown-item')}
              href={`/${PRODUCTS_PATH}/human-ar`}
              a8='click;navigation;go-to-products-human-ar'
            >{t('header.link.product.human_ar')}
            </a>
            <a
              className={combine(classes.dropdownItem, 'dropdown-item')}
              href={`/${PRODUCTS_PATH}/headsets`}
              a8='click;navigation;go-to-products-headsets'
            >{t('header.link.product.headsets')}
            </a>
            <a
              className={combine(classes.dropdownItem, 'dropdown-item')}
              href={`/${PRODUCTS_PATH}`}
              a8='click;navigation;go-to-products-all-products'
            >{t('header.link.product.all_products')}
            </a>
          </div>
        </div>
      </li>

      <li className='nav-item'>
        <div
          className={combine(
            'dropdown',
            classes.navbarDropdownHeader
          )}
        >
          <div
            className={combine(classes.dropMenu, classes.navLink)}
            data-toggle='dropdown'
            aria-haspopup='true'
            aria-expanded='false'
            a8='click;navigation;expand-community'
          >
            {t('footer.heading.community')}&nbsp;
            <i className={combine(
              'fas fa-angle-down',
              classes.navbarDropdownText
            )}
            />
          </div>

          <div
            className={combine(
              'dropdown-menu',
              'justify-content-center',
              classes.dropdownMenuContent
            )}
            aria-labelledby='dropMenu'
          >
            <a
              className={combine(classes.dropdownItem, 'dropdown-item')}
              href='/discover/view-all?try=true&?q=featured-game'
              a8='click;navigation;go-go-made-by-community'
            >
              {t('header.link.community.made_by_community')}
            </a>
            <a
              className={combine(classes.dropdownItem, 'dropdown-item')}
              href='https://8th.io/discord'
              a8='click;navigation;go-to-discord'
            >
              {t('header.link.community.discord')}
            </a>
            <a
              className={combine(classes.dropdownItem, 'dropdown-item')}
              href='https://8th.io/gamejam'
              a8='click;navigation;go-to-game-jam'
            >
              {t('header.link.community.game_jams')}
            </a>
            <a
              className={combine(classes.dropdownItem, 'dropdown-item')}
              href='/community/education'
              a8='click;navigation;go-to-education'
            >
              {t('header.link.community.education')}
            </a>
            <a
              className={combine(classes.dropdownItem, 'dropdown-item')}
              href='https://events.8thwall.com/events/#/list'
              a8='click;navigation;go-to-events'
            >
              {t('header.link.community.events')}
            </a>
          </div>
        </div>
      </li>

      <li className='nav-item'>
        <div
          className={combine(
            'dropdown',
            classes.navbarDropdownHeader
          )}
        >
          <div
            className={combine(classes.dropMenu, classes.navLink)}
            data-toggle='dropdown'
            aria-haspopup='true'
            aria-expanded='false'
            a8='click;navigation;expand-solutions'
          >
            {t('header.heading.industry_solutions')}&nbsp;
            <i className={combine(
              'fas fa-angle-down',
              classes.navbarDropdownText
            )}
            />
          </div>

          <div
            className={combine(
              'dropdown-menu',
              'justify-content-center',
              classes.dropdownMenuContent
            )}
            aria-labelledby='dropMenu'
          >
            <Link
              className={combine(classes.dropdownItem, 'dropdown-item')}
              to='/webar'
              a8='click;navigation;go-to-webar'
            >
              {t('footer.link.why_webar')}
            </Link>
            <a
              className={combine(classes.dropdownItem, 'dropdown-item')}
              href='/industry-solutions'
              a8='click;navigation;go-to-indiustry-solutions'
            >
              {t('header.link.industry_solutions.industries')}
            </a>
            <a
              className={combine(classes.dropdownItem, 'dropdown-item')}
              href='/case-studies'
              a8='click;navigation;go-to-case-studies'
            >
              {t('header.link.industry_solutions.case_studies')}
            </a>
            <a
              className={combine(classes.dropdownItem, 'dropdown-item')}
              href='/discover'
              a8='click;navigation;go-to-discovery-hub'
            >
              {t('footer.link.discover')}
            </a>
          </div>
        </div>
      </li>

      <li className='nav-item'>
        <div
          className={combine(
            'dropdown',
            classes.navbarDropdownHeader
          )}
        >
          <div
            className={combine(classes.dropMenu, classes.navLink)}
            data-toggle='dropdown'
            aria-haspopup='true'
            aria-expanded='false'
            a8='click;navigation;expand-resources'
          >
            {t('footer.link.resources')}&nbsp;
            <i className={combine(
              'fas fa-angle-down',
              classes.navbarDropdownText
            )}
            />
          </div>

          <div
            className={combine(
              'dropdown-menu',
              'justify-content-center',
              classes.dropdownMenuContent
            )}
            aria-labelledby='dropMenu'
          >
            <a
              className={combine(classes.dropdownItem, 'dropdown-item')}
              href='/projects'
              style={{color: '#ad50ff'}}
              a8='click;navigation;go-to-project-library'
            >
              {t('footer.link.project_library')}&nbsp;
              <img
                alt='rocket-icon'
                className={classes.rocketIcon}
                src={rocketIcon}
              />
            </a>
            <a
              className={combine(classes.dropdownItem, 'dropdown-item')}
              href='/docs/'
              a8='click;navigation;go-to-docs'
            >
              {t('header.link.documentation')}
            </a>
            <a
              className={combine(classes.dropdownItem, 'dropdown-item')}
              href='/forum'
              target='_blank'
              rel='noopener noreferrer'
              a8='click;navigation;go-to-forum'
            >
              {t('header.link.forum')}
            </a>
            <Link
              className={combine(classes.dropdownItem, 'dropdown-item')}
              to='/tutorials'
              a8='click;navigation;go-to-tutorials'
            >
              {t('footer.link.tutorials')}
            </Link>
            <a
              className={combine(classes.dropdownItem, 'dropdown-item')}
              href='/blog'
              a8='click;navigation;go-to-blog'
            >
              {t('footer.link.blog')}
            </a>
            <a
              className={combine(classes.dropdownItem, 'dropdown-item')}
              href='/partners'
              a8='click;navigation;go-to-partners'
            >
              {t('header.link.find_a_partner')}
            </a>
            <Link
              className={combine(classes.dropdownItem, 'dropdown-item')}
              to='/resources'
              a8='click;navigation;go-to-resources'
            >
              {t('header.link.all_resources')}
            </Link>
          </div>
        </div>
      </li>

      <li className='nav-item'>
        <Link
          className={combine('nav-link', classes.navLink)}
          to='/pricing'
          a8='click;navigation;go-to-pricing'
        >
          {t('footer.link.pricing')}
        </Link>
      </li>

      <li className='nav-item d-none d-lg-block'>
        <a
          href='/get-started'
          a8='click;navigation;get-started-free'
          className={combine('create-acct', classes.createAcct)}
        >
          {t('header.link.start_free')}
        </a>
      </li>

      <li className='nav-item d-lg-none'>
        <a
          href='/get-started'
          a8='click;navigation;get-started-free'
        >
          <button
            type='button'
            className='btn btn-primary custom-btn'
            css={css`
                margin: 0.5rem auto;
                padding-top: 0.25em;
                padding-bottom: 0.25em;
              `}
          >
            {t('header.link.start_free')}
          </button>
        </a>
      </li>

      <li className='nav-item' id='loginParent'>
        <a
          id='login'
          className={combine('nav-link', classes.navLink, classes.login)}
          href='/login'
          a8='click;navigation;login'
        >
          {t('footer.link.login')}
        </a>
      </li>
    </>
  )
}

export default LoggedOutNavbar
