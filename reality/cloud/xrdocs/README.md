# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

## Setup

### Installing Requirements

Docusaurus requires Node 16.14 or above.

```sh
npm install
```

### Local Development

```sh
npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Checking prod build locally

The previous command only build a dev version of docusaurus with only English version. To test the
docs more thoroughly with all languages enabled and production packaging, please follow the steps
below

```sh
npm run build
```

> [!NOTE]
> This command generates static content into the `build` directory and can be served using any static contents hosting service.

Run the following command to have the built result served using docusaurus http server

```sh
npm run serve
```

## Generate Custom Heading Anchors

For consistency purpose when we are doing localization, all headings for markdown files should have an Id associated.

You can automatically generate new ids for a page you just added by running

```sh
npm run write-heading-ids {path to your doc file}
```

### Example 1 - Generate heading IDs for all studio docs

```sh
npm run write-heading-ids  studio/**/**/*.md
```

### Example 2 - Generate heading IDs for all 8th Wall xrhome docs

```sh
npm run write-heading-ids studio/**/**/*.md
```

### Example 3 - Overwrite heading IDs for all docs in certain directory

```sh
npm run write-heading-ids docs/subdir/**/**/*.md -- --overwrite
```

## Deployment

### Using Jenkins

#### Staging

1. Go to 8th Wall Jenkins instance XrDocs page [here](http://jenkins.8thwall.com:8080/view/xrdocs/)
2. Click run on `xrdocs-deploy-staging` and wait until it's finished
3. Check <https://www-rc.8thwall.com/docs/>

#### Production

1. Go to 8th Wall Jenkins instance XrDocs page [here](http://jenkins.8thwall.com:8080/view/xrdocs/)
2. Click run on `xrdocs-deploy-prod`
3. Wait for `xrdocs-deploy-prod` and `xrdocs-reindex` to finish
4. Check <https://www.8thwall.com/docs/>

### From your local machine

> [!CAUTION]
> This approach is automated by the jenkins tasks above. Only use the following
> steps if you know what you are doing

> [!IMPORTANT]
> You will need to have access to 8th Wall AWS and aws-cli on your machine. Please contact Tony to
> set it up

#### 1. Deploy staging

```sh
npm run build-to-staging
```

#### 2. Invalidate staging docs

Create an invalidation under "Invalidations" [here](https://console.aws.amazon.com/cloudfront/v3/home#/distributions/EL2PHJ1TSQYV0), with object paths

```sh
/docs/
/docs/*
```

After the invalidation is complete, please check <https://www-rc.8thwall.com/docs/>

#### 3. Deploy prod

Run the following command to rollout the current staging version to production

```sh
npm run update-staging-to-prod
```

#### 4. Invalidate prod docs

Run this command

```sh
npm run get-prod-invalidations
```

Create an invalidation under "Invalidations" [here](https://console.aws.amazon.com/cloudfront/v3/home#/distributions/E2QT8W89PO0POQ)
and paste in the output from previous command

After the invalidation is complete, please check <https://8thwall.com/docs/>

## Common Errors

### Docs re-index failed cause no docker deamon running

Example Jenkins message

```sh
09:50:00 docker: Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?.
```

#### Cause

Docker app is closed out by Jenkins due to server restart, idle or something else

#### Solution

1. Please remote login to 8th Wall Jenkins using `Screen Sharing` and our secrets. 
2. Restart colima (Docker runner) in the terminal using this command

```sh
colima start
```

3. Kick off a reindex task on [jenkins ](http://jenkins.8thwall.com:8080/view/xrdocs/job/xrdocs-reindex/)
