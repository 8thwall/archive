import chai from 'chai'

import {
  getTextSizeLimit,
  getAssetSizeLimit,
  getBundleSizeLimit,
  getHcapSizeLimit,
} from '../src/shared/asset-size-limits'

import {
  MAX_TEXT_FILE_UPLOAD_IN_BYTES, MAX_ASSET_FILE_UPLOAD_IN_BYTES, MAX_BUNDLE_SIZE_IN_BYTES,
  MAX_HCAP_SIZE_IN_BYTES,
} from '../src/shared/app-constants'

chai.should()
const {assert} = chai

/* ////////// Tests ////////// */
describe('asset-size-limits', () => {
  it('Defaults are correct if unset', () => {
    const assetLimitOverrides = null
    assert.equal(getTextSizeLimit(assetLimitOverrides), MAX_TEXT_FILE_UPLOAD_IN_BYTES)
    assert.equal(getAssetSizeLimit(assetLimitOverrides), MAX_ASSET_FILE_UPLOAD_IN_BYTES)
    assert.equal(getBundleSizeLimit(assetLimitOverrides), MAX_BUNDLE_SIZE_IN_BYTES)
    assert.equal(getHcapSizeLimit(assetLimitOverrides), MAX_HCAP_SIZE_IN_BYTES)
  })

  it('Defaults are correct if can\'t parse', () => {
    const assetLimitOverrides = 'wontparse'
    assert.equal(getTextSizeLimit(assetLimitOverrides), MAX_TEXT_FILE_UPLOAD_IN_BYTES)
    assert.equal(getAssetSizeLimit(assetLimitOverrides), MAX_ASSET_FILE_UPLOAD_IN_BYTES)
    assert.equal(getBundleSizeLimit(assetLimitOverrides), MAX_BUNDLE_SIZE_IN_BYTES)
    assert.equal(getHcapSizeLimit(assetLimitOverrides), MAX_HCAP_SIZE_IN_BYTES)
  })

  it('Use default if property not set but object parses', () => {
    const assetLimitOverrides = '{}'
    assert.equal(getTextSizeLimit(assetLimitOverrides), MAX_TEXT_FILE_UPLOAD_IN_BYTES)
    assert.equal(getAssetSizeLimit(assetLimitOverrides), MAX_ASSET_FILE_UPLOAD_IN_BYTES)
    assert.equal(getBundleSizeLimit(assetLimitOverrides), MAX_BUNDLE_SIZE_IN_BYTES)
    assert.equal(getHcapSizeLimit(assetLimitOverrides), MAX_HCAP_SIZE_IN_BYTES)
  })

  it('Use default if property invalid', () => {
    const assetLimitOverrides = '{"text": 1, "asset": {}, "bundle": null, "hcap": []}'
    assert.equal(getTextSizeLimit(assetLimitOverrides), 1)  // Ensure parsed object correctly
    assert.equal(getAssetSizeLimit(assetLimitOverrides), MAX_ASSET_FILE_UPLOAD_IN_BYTES)
    assert.equal(getBundleSizeLimit(assetLimitOverrides), MAX_BUNDLE_SIZE_IN_BYTES)
    assert.equal(getHcapSizeLimit(assetLimitOverrides), MAX_HCAP_SIZE_IN_BYTES)

    const assetLimitOverrides2 = `{
      "text": 1,
      "asset": ">100 MB, please",
      "bundle": "100 PB",
      "hcap": "4.kB"}
    `
    assert.equal(getTextSizeLimit(assetLimitOverrides2), 1)  // Ensure parsed object correctly
    assert.equal(getAssetSizeLimit(assetLimitOverrides2), MAX_ASSET_FILE_UPLOAD_IN_BYTES)
    assert.equal(getBundleSizeLimit(assetLimitOverrides2), MAX_BUNDLE_SIZE_IN_BYTES)
    assert.equal(getHcapSizeLimit(assetLimitOverrides2), MAX_HCAP_SIZE_IN_BYTES)
  })

  it('Can override with numbers', () => {
    const assetLimitOverrides = '{"text": 1, "asset": "2", "bundle": "3 ", "hcap": 4}'
    assert.equal(getTextSizeLimit(assetLimitOverrides), 1)
    assert.equal(getAssetSizeLimit(assetLimitOverrides), 2)
    assert.equal(getBundleSizeLimit(assetLimitOverrides), 3)
    assert.equal(getHcapSizeLimit(assetLimitOverrides), 4)
  })

  it('Can set bytes in KB, MB, or GB with spaces in different places', () => {
    const assetLimitOverrides =
      '{"text": "1KB", "asset": "2  MB", "bundle": ".5GB ", "hcap": "  4.25KB"}'
    assert.equal(getTextSizeLimit(assetLimitOverrides), 1024)
    assert.equal(getAssetSizeLimit(assetLimitOverrides), 2097152)
    assert.equal(getBundleSizeLimit(assetLimitOverrides), 536870912)
    assert.equal(getHcapSizeLimit(assetLimitOverrides), 4352)
  })

  it('Ignores case on units', () => {
    const assetLimitOverrides = '{"text": "1KB", "asset": "1kb", "bundle": "1kB", "hcap": "1Kb"}'
    assert.equal(getTextSizeLimit(assetLimitOverrides), 1024)
    assert.equal(getAssetSizeLimit(assetLimitOverrides), 1024)
    assert.equal(getBundleSizeLimit(assetLimitOverrides), 1024)
    assert.equal(getHcapSizeLimit(assetLimitOverrides), 1024)
  })

  it('"B" in units is optional', () => {
    const assetLimitOverrides = '{"text": "1K", "asset": "1k", "bundle": "1.5 G", "hcap": " 1 M "}'
    assert.equal(getTextSizeLimit(assetLimitOverrides), 1024)
    assert.equal(getAssetSizeLimit(assetLimitOverrides), 1024)
    assert.equal(getBundleSizeLimit(assetLimitOverrides), 1610612736)
    assert.equal(getHcapSizeLimit(assetLimitOverrides), 1048576)
  })
})
