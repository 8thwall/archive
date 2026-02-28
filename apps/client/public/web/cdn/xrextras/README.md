# Deploying XRExtras

## Push a dev build to CDN

```
cd ~/repo/code8/apps/client/public/web/xrextras
node ../cdn/xrextras/build-rc.js
```

## Push the prod build to CDN

```
cd ~/repo/code8/apps/client/public/web/xrextras
npm run build
cp dist/xrextras.js ~/repo/prod8/cdn/web/xrextras/xrextras-x.x.x.js
# Send, test, get approval, and land
cp ~/repo/prod8/cdn/web/xrextras/xrextras-x.x.x.js ~/repo/prod8/cdn/web/xrextras/xrextras-beta.js
# Send, test, get approval, and land
cp ~/repo/prod8/cdn/web/xrextras/xrextras-beta.js ~/repo/prod8/cdn/web/xrextras/xrextras.js
# Send, test, get approval, and land
```

Reference on how prod8 cdn works: https://<REMOVED_BEFORE_OPEN_SOURCING>.atlassian.net/wiki/spaces/AR/pages/1919747282/CDN+Upload+with+prod8

## Invalidate cache

We used to have to do this manually but now it should be automatically taken care of by Jenkins.
The info here is only for archive purpose.

1) https://console.aws.amazon.com/cloudfront/home?#distribution-settings:E3RNQEQVU9JJ51
2) Invalidations -> Pick the latest version (Check Details to make sure it is xrextras.js) -> Copy -> Invalidate
