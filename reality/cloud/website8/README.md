# Website8

This is 8th Wall main static website. Our products, pricing, showcases, TOS and contact forms are on this site. Docs are not here. Console is not here.

## Getting Started

* Clone the `website8` repo
* Run `npm install` to install necessary npm modules

## Develop

To develop run `npm run develop`

When you are ready to prep for deploy run `npm run build` which would put everything into the `public` folder. You can then see this content locally as well by running `npm run serve`

### Test logged in users
Run xrhome locally and log in. Stop xrhome, then run website8 on the same port as xrhome. You can change the port number by modifying `package.json`

```diff
{
  "scripts": {
-   "develop": "gatsby develop"
+   "develop": "gatsby develop -p 3001",
    ...
}

```

Run `npm run develop -- --https` to start website8 and you should now be logged in

## Deployment

### Deploy staging.8thwall.com
~~~
npm run buildToStaging
~~~
Create an invalidation under "Invalidations" [here](https://console.aws.amazon.com/cloudfront/v3/home#/distributions/EL2PHJ1TSQYV0), with object paths: `/ /*`. After the invalidation is complete:

~~~
open https://staging.8thwall.com
~~~

### Deploy www.8thwall.com
~~~
npm run updateStagingToProd
~~~
Create an invalidation under "Invalidations" [here](https://console.aws.amazon.com/cloudfront/v3/home#/distributions/E2QT8W89PO0POQ)
and paste in the output from

~~~
npm run getProdInvalidations
~~~
Using a specified list for the prod invalidation limits the redownload of static files from S3. After the invalidation is complete:

~~~
open https://www.8thwall.com
~~~

### Read More
We are using S3 as the origin. So files will need to be put into the right bucket based on their type

### Upload static files
Static files (file with hashes in the filename), are stored in xrhome_static bucket where they are cached forever
both on CloudFront and on the client. They need a name that never change. If you change the content, you need to
use a new name.

Static content like images and videos already have content-hash in their generate file names, you can upload them
by running `npm run uploadStatic`

### Upload website
Website files don't have hashes in their filenames and are thus stored by versioning folder.

* To upload the website to the staging environment, do `npm run uploadWebsiteStaging`
* To update the website from staging to prod environment, do `npm run updateStagingToProd`

### Upload downloads
We have a set of zip files that our users can download content from, we store them on <REMOVED_BEFORE_OPEN_SOURCING>/static/download
with the prefix on the update date.

To add a new file, upload it using aws cp  (make sure to add --cache-control flag) onto
<REMOVED_BEFORE_OPEN_SOURCING>/static/download/${todayDate}/ folder

Here is what was run when we first made these files available for download

~~~
aws s3 cp --cache-control 'public,max-age=31536000' --recursive . s3://<REMOVED_BEFORE_OPEN_SOURCING>/static/download/20200604/
~~~

### Updating Gatsby

We have an S3 to store static assets e.g. images, JS, and videos. That's why we have an
`assetPrefix` option inside our `gatsby-config.js` file. However, this path is also where gatsby
will looking for `*/page-data.json`. As a result, we have to patch out gatsby to replace the path
for `page-data` with the deployment base path.

You will have to update our `patches/gatsby+<xxx>.patch` when you update gatsby.

Simply go into `node_modules/gatsby` and modify the paths used to load page data to
`getPageDataParent8w` then run the command

```SHELL
npx patch-package gatsby
```
