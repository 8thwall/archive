const getPageDescriptionForAccountBrowse = account => (
  account.shortName === '8thwall'
    ? 'Explore WebAR and WebVR projects, view and clone code, and try projects in AR. ' +
    '8th Wall Project Library includes sample projects for Image Targets, ' +
    'Face Effects, World Tracking and more.'
    : account.bio
)

module.exports = {
  getPageDescriptionForAccountBrowse,
}
