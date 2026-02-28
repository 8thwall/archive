# Hubspot Theme

## Setup

### Node Requirements
The HubSpot CLI requires Node v14+. To manage multiple node versions, [install nvm](https://github.com/nvm-sh/nvm#installing-and-updating) and then:

```
nvm install 14.21.2
nvm alias hubspot-cms 14.21.2
nvm use hubspot-cms
```
### Setup HubSpot CLI

Install Hubspot CLI via `npm install -g @hubspot/cli`. After this, run `hs init` and follow the steps to add your first personal access key. This will be kept in your personal `hubspot.config.yaml` file.

NOTE: Only the *Designer Manager* permission is necessary for the Personal Access Token that is generated.

To add more personal access keys, run `hs auth` and follow the steps to add multiple keys. You'll need at least two, one for the test Hubspot account and the production Hubspot account. For this guide, the access key for the 8th Wall Test account is `dev`, and the access key for the 8th Wall production account is `prod`.

## Fetching from Hubspot

```
hs fetch [source] [destination] --overwrite --mode=[draft/publish] --portal=[portal-name]
```

## Pushing to Hubspot

```
hs upload [source] [destination] --mode=[draft/publish] --portal=[portal-name]
```

## Developer Workflow

1. Sync your code with the development HubSpot. If there is a mistmatch, contact #8w-devteam to verify if someone else is actively editing this theme.

```
hs fetch theme8 theme8 --overwrite --mode=draft --portal=dev
```

Note: When the `mode` flag is set to `publish` or you don't set a `mode` flag, the CLI will only fetch what has been published. To fetch the entire theme on Hubspot, including all the work-in-progress components, set the `mode` flag to `draft`.

2. Make changes on the HubSpot editor or locally then upload, etc. etc. more steps for editing

It's highly recommended to edit your theme in Hubspot, since you can't preview or add modules on a local environment. If you need to modify something locally, please remember to install the VSCode extension for Hubspot so you can set the language mode to HubL. Saving the file without setting the language mode to HubL may cause VSCode to reformat the file and break the code when you push to Hubspot.

3. Fetch your changes from HubSpot

Note: Fetching with Hubspot will not erase local files that were deleted on Hubspot. The current known solution is to delete your local files and fetch again from Hubspot. This is why editing the theme locally is not recommended.

4. Create a MR

5. Get MR approved

6. Publish new changes to production HubSpot

```
hs upload theme8 theme8 --mode=publish --portal=prod
```

## External Resources

* [Hubspot Getting Started Guide](https://developers.hubspot.com/docs/cms/guides/getting-started) - Quick guide to setting up, and coordinating local development to developing on Hubspot's Design Tools
* [Hubspot CLI Commands Doc](https://developers.hubspot.com/docs/cms/developer-reference/local-development-cli)
* [Hubspot Module and Theme Fields Doc](https://developers.hubspot.com/docs/cms/building-blocks/module-theme-fields)
* [Hubspot Default Modules Doc](https://developers.hubspot.com/docs/cms/building-blocks/modules/default-modules)
