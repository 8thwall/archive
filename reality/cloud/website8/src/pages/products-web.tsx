import React from 'react'
import {Link, graphql} from 'gatsby'
import {useTranslation} from 'gatsby-plugin-react-i18next'

import Layout from '../components/layouts/layout'
import useCarousel from '../hooks/use-carousel'
import {ShowcaseSelect, ShowcaseCarousel, ShowcaseSelectGroup, ShowcaseSlide} from '../components/showcase'
import Button8 from '../components/button8'
import {combine} from '../styles/classname-utils'
import webGearsImg from '../../img/web-gears.svg'
import faceEffectsForWebVideo from '../../img/vids/engine-features/face-effects-for-web.mp4'
import engineWorldTrackingImg from '../../img/vids/engine-features/engine-world-tracking-for-web.mp4'
import lightshipVpsForWebVideo from '../../img/vids/engine-features/lightship-vps-for-web.mp4'
import engineImageTargetsVideo from '../../img/vids/engine-features/engine-image-targets-noportal-forweb.mp4'
import engineModularFrameworkVideo from '../../img/vids/engine-features/engine-modular-framework-for-web.mp4'
import faceEffectsForWebVideoCover from '../../img/vids/engine-features/face-effects-for-web.jpg'
import engineWorldTrackingImgCover from '../../img/vids/engine-features/engine-world-tracking-for-web.jpg'
import lightshipVpsVideoCover from '../../img/vids/engine-features/lightship-vps-for-web.jpg'
import engineImageTargetsVideoCover from '../../img/vids/engine-features/engine-image-targets-noportal-forweb.jpg'
import engineModularFrameworkVideoCover from '../../img/vids/engine-features/engine-modular-framework-for-web.jpg'
import editorNoConsoleImg from '../../img/editor-screens/editor-no-console.jpg'
import editorWithConsoleImg from '../../img/editor-screens/editor-with-console.jpg'
import templatesImg from '../../img/editor-screens/templates.jpg'
import publishModalImg from '../../img/editor-screens/publish-modal.jpg'
import scanToPreviewImg from '../../img/editor-screens/scan-to-preview.jpg'
import reviewSyncConflictImg from '../../img/editor-screens/review-sync-conflict.jpg'
import teamManagerImg from '../../img/editor-screens/team-manager.jpg'
import projectHistoryImg from '../../img/editor-screens/project-history-3x.jpg'
import clientManagementImg from '../../img/editor-screens/client-management.jpg'
import globalWebHostingImg from '../../img/editor-screens/global-web-hosting.jpg'
import customDomainImg from '../../img/editor-screens/custom-domain.jpg'
import sharingScreenImg from '../../img/editor-screens/sharing-screen.jpg'
import aframeLogo from '../../img/engines/aframe.png'
import threeJsLogo from '../../img/engines/threejs.png'
import babylonLogo from '../../img/engines/babylon.png'
import playCanvasLogo from '../../img/engines/playcanvas.png'
import * as classes from './products-web.module.scss'
import DeviceDeploySection from '../components/device-deploy-section'
import DotyDemoHero from '../components/doty-demo-hero'

export default () => {
  const {i18n, t} = useTranslation(['product-web-page'])
  const [select, slide] = useCarousel(1)
  const [collabSelect, collabSlide] = useCarousel(1)
  const [publishSelect, publishSlide] = useCarousel(1)

  return (
    <Layout
      title={t('meta.title')}
      description={t('meta.description')}
    >
      <DotyDemoHero
        title={t('doty_demo_hero.title')}
        subtitle={t('doty_demo_hero.subtitle')}
        locale={i18n.language}
      />

      <section className={classes.engineFeatureContainer}>
        <h2 className={combine('h2-xl', classes.sectionHeading)}>
          <img src={webGearsImg} alt='gears' /> {t('heading.ar_engine')}
        </h2>

        <div className={combine('row', classes.engineFeatureSection)} id='world-effects'>
          <div className='col-md-6 col-sm-12'>
            <video
              autoPlay
              loop
              muted
              playsInline
              src={engineWorldTrackingImg}
              poster={engineWorldTrackingImgCover}
            />
          </div>
          <div className={combine('col-md-6 col-sm-12', classes.rightSubSection)}>
            <h2>{t('heading.world_effects')}</h2>
            <p className='text8-lg'>{t('description.world_effects')}</p>
          </div>
        </div>

        <div className={combine('row', classes.engineFeatureSection)} id='lightship-vps'>
          <div className='order-sm-0 order-md-1 col-md-6 col-sm-12'>
            <video
              autoPlay
              loop
              muted
              playsInline
              src={lightshipVpsForWebVideo}
              poster={lightshipVpsVideoCover}
            />
          </div>
          <div
            className={combine('order-sm-1 order-md-0 col-md-6 col-sm-12', classes.leftSubSection)}
          >
            <h2>{t('heading.lightship_vps')}</h2>
            <p className='text8-lg'>{t('description.lightship_vps')}</p>
          </div>
        </div>

        <div className={combine('row', classes.engineFeatureSection)} id='image-target'>
          <div className='col-md-6 col-sm-12'>
            <video
              autoPlay
              loop
              muted
              playsInline
              src={engineImageTargetsVideo}
              poster={engineImageTargetsVideoCover}
            />
          </div>
          <div
            className={combine('col-md-6 col-sm-12', classes.rightSubSection)}
          >
            <h2>{t('heading.image_targets')}</h2>
            <p className='text8-lg'>{t('description.image_targets')}</p>
          </div>
        </div>

        <div className={combine('row', classes.engineFeatureSection)} id='face-effect'>
          <div className='order-sm-0 order-md-1 col-md-6 col-sm-12'>
            <video
              autoPlay
              loop
              muted
              playsInline
              src={faceEffectsForWebVideo}
              poster={faceEffectsForWebVideoCover}
            />
          </div>
          <div className={combine('order-sm-1 order-md-0 col-md-6 col-sm-12', classes.leftSubSection)}>
            <h2>{t('heading.face_effects')}</h2>
            <p className='text8-lg'>{t('description.face_effects')}</p>
          </div>
        </div>

        <div className={combine('row', classes.engineFeatureSection)} id='modular-framework'>
          <div className='col-md-6 col-sm-12'>
            <video
              autoPlay
              loop
              muted
              playsInline
              src={engineModularFrameworkVideo}
              poster={engineModularFrameworkVideoCover}
            />
          </div>
          <div className={combine('col-md-6 col-sm-12', classes.rightSubSection)}>
            <h2>{t('heading.modular_framework')}</h2>
            <p className='text8-lg'>{t('description.modular_framework')}</p>
          </div>
        </div>
      </section>

      <DeviceDeploySection />

      <section className='light'>
        <h2 className={combine('h2-xl', classes.sectionHeading)}>
          <img src={webGearsImg} /> {t('heading.cloud_editor_hosting')}
        </h2>

        <div className={classes.cloudProduct}>
          <ShowcaseCarousel>
            <ShowcaseSlide img={editorNoConsoleImg} active={slide(1)}>
              <p className='text8-md'>{t('showcase_slide.cloud_based_editor_features')}</p>
            </ShowcaseSlide>
            <ShowcaseSlide img={templatesImg} active={slide(2)}>
              <p className='text8-md'>{t('showcase_slide.choose_from_library')}</p>
            </ShowcaseSlide>
            <ShowcaseSlide img={editorWithConsoleImg} active={slide(3)}>
              <p className='text8-md'>{t('showcase_slide.wirelessly_debug')}</p>
            </ShowcaseSlide>
            <ShowcaseSlide img={scanToPreviewImg} active={slide(4)}>
              <p className='text8-md'>{t('showcase_slide.automated_build_system')}</p>
            </ShowcaseSlide>
            <ShowcaseSlide img={publishModalImg} active={slide(5)}>
              <p className='text8-md'>{t('showcase_slide.freedom_to_integrate')}</p>
            </ShowcaseSlide>
          </ShowcaseCarousel>
          <div className={classes.showcaseSelectGroupContainer}>
            <h2>Create</h2>
            <ShowcaseSelectGroup>
              <ShowcaseSelect select={select(1)} active={slide(1)}>{t('showcase_select.fully_featured_text_editor')}</ShowcaseSelect>
              <ShowcaseSelect select={select(2)} active={slide(2)}>{t('showcase_select.templates')}</ShowcaseSelect>
              <ShowcaseSelect select={select(3)} active={slide(3)}>{t('showcase_select.remote_debugger')}</ShowcaseSelect>
              <ShowcaseSelect select={select(4)} active={slide(4)}>{t('showcase_select.instant_preview')}</ShowcaseSelect>
              <ShowcaseSelect select={select(5)} active={slide(5)}>{t('showcase_select.external_library_support')}</ShowcaseSelect>
            </ShowcaseSelectGroup>
          </div>
        </div>
        <div className={classes.cloudProduct}>
          <ShowcaseCarousel>
            <ShowcaseSlide img={reviewSyncConflictImg} active={collabSlide(1)}>
              <p className='text8-md'>{t('showcase_slide.allows_multiple_people')}</p>
            </ShowcaseSlide>
            <ShowcaseSlide img={teamManagerImg} active={collabSlide(2)}>
              <p className='text8-md'>{t('showcase_slide.invite_unlimited_members')}</p>
            </ShowcaseSlide>
            <ShowcaseSlide img={projectHistoryImg} active={collabSlide(3)}>
              <p className='text8-md'>{t('showcase_slide.compare_commits_over_time')}</p>
            </ShowcaseSlide>
            <ShowcaseSlide img={clientManagementImg} active={collabSlide(4)}>
              <p className='text8-md'>{t('showcase_slide.use_clients_bug_fixes')}</p>
            </ShowcaseSlide>
          </ShowcaseCarousel>
          <div className={classes.showcaseSelectGroupContainer}>
            <h2>{t('heading.collaborate')}</h2>
            <ShowcaseSelectGroup>
              <ShowcaseSelect select={collabSelect(1)} active={collabSlide(1)}>{t('showcase_select.source_control')}</ShowcaseSelect>
              <ShowcaseSelect select={collabSelect(2)} active={collabSlide(2)}>{t('showcase_select.team_management')}</ShowcaseSelect>
              <ShowcaseSelect select={collabSelect(3)} active={collabSlide(3)}>{t('showcase_select.commit_history')}</ShowcaseSelect>
              <ShowcaseSelect select={collabSelect(4)} active={collabSlide(4)}>{t('showcase_select.code_isolation')}</ShowcaseSelect>
            </ShowcaseSelectGroup>
          </div>
        </div>

        <div className={classes.cloudProduct}>
          <ShowcaseCarousel>
            <ShowcaseSlide img={publishModalImg} active={publishSlide(1)}>
              <p className='text8-md'>{t('showcase_slide.publish_rollback')}</p>
            </ShowcaseSlide>
            <ShowcaseSlide img={globalWebHostingImg} active={publishSlide(2)}>
              <p className='text8-md'>{t('showcase_slide.amazon_cloudfront')}</p>
            </ShowcaseSlide>
            <ShowcaseSlide img={customDomainImg} active={publishSlide(3)}>
              <p className='text8-md'>{t('showcase_slide.custom_domains')}</p>
            </ShowcaseSlide>
            <ShowcaseSlide img={sharingScreenImg} active={publishSlide(4)}>
              <p className='text8-md'>{t('showcase_slide.generate_qr_codes')}</p>
            </ShowcaseSlide>
          </ShowcaseCarousel>
          <div className={classes.showcaseSelectGroupContainer}>
            <h2>{t('heading.publish')}</h2>
            <ShowcaseSelectGroup>
              <ShowcaseSelect select={publishSelect(1)} active={publishSlide(1)}>{t('showcase_select.deployment_management')}</ShowcaseSelect>
              <ShowcaseSelect select={publishSelect(2)} active={publishSlide(2)}>{t('showcase_select.global_web_hosting')}</ShowcaseSelect>
              <ShowcaseSelect select={publishSelect(3)} active={publishSlide(3)}>{t('showcase_select.custom_domains')}</ShowcaseSelect>
              <ShowcaseSelect select={publishSelect(4)} active={publishSlide(4)}>{t('showcase_select.sharing')}</ShowcaseSelect>
            </ShowcaseSelectGroup>
          </div>
        </div>
      </section>

      <section>
        <h2 className={classes.sectionHeading}>{t('heading.support_frameworks')}</h2>

        <div className={combine('row', classes.engineBoxContainer)}>

          <div className={classes.engineBox}>
            <img src={aframeLogo} className={classes.engineIcon} alt='a frame logo' />
          </div>

          <div className={classes.engineBox}>
            <img src={threeJsLogo} className={classes.engineIcon} alt='three JS Logo' />
          </div>

          <div className={classes.engineBox}>
            <img src={babylonLogo} className={classes.engineIcon} alt='babylon logo' />
          </div>

          <div className={classes.engineBox}>
            <img src={playCanvasLogo} className={classes.engineIcon} alt='play canvas logo' />
          </div>

        </div>

      </section>

      <section className='light'>
        <div className='row justify-content-center'>
          <h2>{t('heading.get_started')}</h2>
          <div className='col-12 text-center'>
            <Button8 className='mt-2 mb-lg-0 mb-3'>
              <Link className={classes.viewPlanAndPricingLinkOut} to='/pricing'>
                {t('link.view_plans_pricing')}
              </Link>
            </Button8>
          </div>

        </div>
      </section>
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
