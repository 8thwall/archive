import WorldEffectsVideo from '../../static/video/ftue_world_effects.mp4'
import HelloWorldNianticVideo from '../../static/video/ftue_hello_world_niantic.mp4'
import VPSGuideVideo from '../../static/video/ftue_vps_guide.mp4'
import WorldEffectsImage from '../../static/video/ftue_world_effects.png'
import VPSGuideImage from '../../static/video/ftue_vps_guide.png'
import HelloWorldNianticImage from '../../static/video/ftue_hello_world_niantic.png'
import Hello8thWallCoverImage from '../../static/video/ftue_hello_8th_wall.png'

const DEV_FTUE_SAMPLE_APP_UUID = '927bd419-db4e-4047-ab45-d1a3426b7c64'
const DEV_PENDO_ID = '4R-uOZx8wbsPGKqfatQOLPtAPfg'

const DEV_FTUE_SAMPLE_PROJECTS = [
  {
    uuid: DEV_FTUE_SAMPLE_APP_UUID,
    title: 'account_dashboard_page.first_time_user_card.hello_world_niantic.title',
    description: 'account_dashboard_page.first_time_user_card.hello_world_niantic.description',
    appName: 'wayne-cloud-studio',
    accountName: '8thwall',
    image: HelloWorldNianticImage,
    video: HelloWorldNianticVideo,
    pendoId: DEV_PENDO_ID,
  },
  {
    uuid: DEV_FTUE_SAMPLE_APP_UUID,
    title: 'account_dashboard_page.first_time_user_card.vps_guide.title',
    description: 'account_dashboard_page.first_time_user_card.vps_guide.description',
    appName: 'wayne-cloud-studio',
    accountName: '8thwall',
    image: VPSGuideImage,
    video: VPSGuideVideo,
    pendoId: DEV_PENDO_ID,
  },
  {
    uuid: DEV_FTUE_SAMPLE_APP_UUID,
    title: 'account_dashboard_page.first_time_user_card.world_effects_guide.title',
    description: 'account_dashboard_page.first_time_user_card.world_effects_guide.description',
    appName: 'wayne-cloud-studio',
    accountName: '8thwall',
    image: WorldEffectsImage,
    video: WorldEffectsVideo,
    pendoId: DEV_PENDO_ID,
  },
]

const PROD_FTUE_SAMPLE_PROJECTS = [
  {
    uuid: '69e52ecb-637d-42ce-be4b-da758c41a01c',
    title: 'account_dashboard_page.first_time_user_card.hello_world_niantic.title',
    description: 'account_dashboard_page.first_time_user_card.hello_world_niantic.description',
    appName: 'hello-world',
    accountName: '8thwall',
    image: HelloWorldNianticImage,
    video: HelloWorldNianticVideo,
    pendoId: 'TSJQGTweGesNbQQ8bpVztDxuTng',
  },
  {
    uuid: '37631cab-191c-4ac9-acef-faba113de54a',
    title: 'account_dashboard_page.first_time_user_card.vps_guide.title',
    description: 'account_dashboard_page.first_time_user_card.vps_guide.description',
    appName: 'hello-vps',
    accountName: '8thwall',
    image: VPSGuideImage,
    video: VPSGuideVideo,
    pendoId: 'Lf5-TgrkuMmb5q8A5I1FDPpeSVE',
  },
  {
    uuid: 'e242c461-ee90-44d2-b139-2958bc680978',
    title: 'account_dashboard_page.first_time_user_card.world_effects_guide.title',
    description: 'account_dashboard_page.first_time_user_card.world_effects_guide.description',
    appName: 'hello-world-effects',
    accountName: '8thwall',
    image: WorldEffectsImage,
    video: WorldEffectsVideo,
    pendoId: 'QxfrLZ2PYr8Kb4CQyBwiI156KHA',
  },
]

const ONBOARDING_FIRST_PROJECT = BuildIf.ALL_QA
  ? DEV_FTUE_SAMPLE_PROJECTS[0]
  : {
    uuid: '57ec3357-45bd-4756-a3a1-b032d9ba3733',
    accountName: '8thwall',
    appName: 'hello',
    image: Hello8thWallCoverImage,
  }

const FTUE_SAMPLE_PROJECTS = BuildIf.ALL_QA ? DEV_FTUE_SAMPLE_PROJECTS : PROD_FTUE_SAMPLE_PROJECTS

export {
  DEV_FTUE_SAMPLE_APP_UUID,
  FTUE_SAMPLE_PROJECTS,
  ONBOARDING_FIRST_PROJECT,
}
