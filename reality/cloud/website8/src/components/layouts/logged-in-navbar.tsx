import React from 'react'
import {Link} from 'gatsby'
import {useTranslation} from 'gatsby-plugin-react-i18next'

import UserDropdown from '../user-dropdown'
import rocketIcon from '../../../img/rocketIcon.png'
import {combine} from '../../styles/classname-utils'
import * as classes from './header.module.scss'
import {useUserContext, IUserContext} from '../../common/user-context'

const LoggedInNavbar = () => {
  const {t} = useTranslation(['navigation'])
  const {
    userAttributes,
    signOut,
  }: IUserContext = useUserContext()

  return (
    <>
      <li className='nav-item'>
        <Link
          className={combine('nav-link', classes.navLink)}
          to='/docs/'
          a8='click;navigation;go-to-docs'
        >
          {t('header.link.documentation')}
        </Link>
      </li>

      <li className='nav-item'>
        <a
          className={combine('nav-link', classes.navLink)}
          href='/projects'
          a8='click;navigation;go-to-project-library'
        >
          {t('footer.link.project_library')}&nbsp;
          <img
            alt='rocket-icon'
            className={classes.rocketIcon}
            src={rocketIcon}
          />
        </a>
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
            href=''
            a8='click;navigation;expand-product'
          >
            {t('header.heading.product')}&nbsp;
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
              href='/discover'
              a8='click;navigation;go-to-discovery-hub'
            >
              {t('footer.link.discover')}
            </a>
            <Link
              className={combine(classes.dropdownItem, 'dropdown-item')}
              to='/products'
              a8='click;navigation;go-to-feature'
            >
              {t('header.link.features')}
            </Link>
            <a
              className={combine(classes.dropdownItem, 'dropdown-item')}
              href='/industry-solutions'
              a8='click;navigation;go-to-indiustry-solutions'
            >
              {t('header.link.industry_solutions.industries')}
            </a>
            <Link
              className={combine(classes.dropdownItem, 'dropdown-item')}
              to='/pricing'
              a8='click;navigation;go-to-pricing'
            >
              {t('footer.link.pricing')}
            </Link>
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
            a8='click;navigation;expand-learn'
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
            <a
              className={combine(classes.dropdownItem, 'dropdown-item')}
              href='/discover/view-all?try=true&?q=featured-game'
              a8='click;navigation;go-go-made-by-community'
            >
              {t('header.link.community.made_by_community')}
            </a>
            <Link
              className={combine(classes.dropdownItem, 'dropdown-item')}
              to='/resources'
              a8='click;navigation;go-to-all-resources'
            >
              {t('header.link.all_resources')}
            </Link>
          </div>
        </div>
      </li>

      <li className='nav-item'>
        <UserDropdown
          user={userAttributes}
          signOut={signOut}
        />
      </li>
    </>
  )
}

export default LoggedInNavbar
