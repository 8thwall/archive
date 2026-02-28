## Developing app8
To test changes to app8 in a project, you can:

1) Build app8 with:
```bash
npm install --legacy-peer-deps
npm run build
```

2) Upload to aws with `aws s3 cp dist/app8.js s3://<REMOVED_BEFORE_OPEN_SOURCING>/web/hosting/rc/app8-parisdev.js` (replace `parisdev` with your name).

3) Then go to a cloud editor project and add this line to `head.html` (replace `parisdev` with your name):

```
<meta name="8thwall:internal" content="app8:rc/parisdev">
```

For studio project, add this line to the `manifest.json` (replace `parisdev` with your name):
```
{
  "version": 1, (note that this may change in the future, so make sure to check the latest version)
  "config": {
    "app8Url": "https://cdn-dev.8thwall.com/web/hosting/rc/app8-parisdev.js"
  }
}
```

## Deploying app8

To test changes to app8 in a project, you can:

1) Build app8 with:
```bash
npm install
npm run build
```

2) Create a timestamped version of your app8 changes in the prod8 repo and raise a PR using:
```bash
npm run copy
```

3) Once your prod8 PR is landed, update `~/repo/code8/reality/cloud/aws/lambda/studio-deploy/constants.ts` by incrementing `BUILD_VERSION_ID` and updating `DEFAULT_APP8_SCRIPT_URL` with your new app8 url.

4) Test your new app8 file by deploying `studio-deploy-qa` and then `studio-deploy-prod` if working.
