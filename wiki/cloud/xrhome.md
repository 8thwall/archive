# XRHome

Repo location:

Release process: Creating a new XRHome Release

## Client

The client code runs in the browsers as well on on the server for server-side-rendered pages.

### Redux

We use redux for global shared state within the site. This tends to store global information like login state, plus what basically amounts to partial clones of the database. We don't tend to use Redux for state that only needs to remain as long as a user is on a specific page or view.

### UI

Historically we've been using `react-semantic-ui` for the component library, but have recently started our own components in `src/client/ui`. This folder also houses our theme definitions.

See more: Main UI Library

### CSS Styling

Historically we've used sass, but we've been transitioning to `react-jss` for new code.

### String Migration

If you're going to be adding text to be read on XRHome, please reference this XRHome i18n Migration Guide before doing so.

## Servers

The xrhome directory contains code for two servers: "Console", and "Apps".

For production, Console is behind a CDN on <server> and Apps is on <server>

They run on ElasticBeanstalk which can be found here:

Apps is also deployed globally to 6 locations total.

### Controllers

| Name | Used By | Description |
|------|---------|-------------|
| Accounts Controller | console | Manage developer accounts (workspaces) |
| API Keys Controller | console | Manage Enterprise API keys for <server> |
| App Deployment Controller | console | Manage deployments for Cloud-Hosted projects |
| Apps Billing Controller | console | Manage app-level commercial licenses |
| Apps Controller | console | Manage app information |
| Asset Metadata Controller | console | Serve information related to Cloud Editor assets |
| Billing Controller | console | Manage billing for a workspace |
| Blog Controller | console | Serve blog content for client-side routing |
| Blog Render Controller | console | Server-side render blog pages |
| Contracts Controller | console | Manage custom contracts within a workspace |
| CRM Controller | console | Manage contact information within Hubspot |
| Dev Token Controller | apps, console | Handle preview QR codes and authenticating developer devices to access private content |
| Discovery Metadata Controller | console | Server-side render discovery pages for featured profiles/projects |
| Domains Controller | console | Manage custom domains for Cloud-Hosted projects |
| Git Controller | console | Handle actions related to managing repos (apps or modules), and handling asset uploads from the Cloud Editor |
| Hosting Controller | apps | Serves apps using legacy hosting, including AR Cameras |
| Image Targets Controller | console | Manage image targets |
| Jwks Controller | apps | Expose public keys required for XR Session Token logic |
| Module Dependency Controller | console | Allows users to import modules, and access metadata and version information for their dependencies |
| Module Deployment Controller | console | Manage module deployments |
| Module User Controller | console | Bookkeeping for managing editor access to module repos |
| Modules Controller | console | Manage module information |
| Oauth Controller | console | Handle incoming oauth for dev/staging environments |
| Partners Controller | console | Serves info for |
| Partners Metadata Controller | console | Serves metadata for /partners page |
| Payments Controller | console | Set up accepting payments through the Payments Module |
| Project Library Metadata Controller | console | Serves metadata for /projects page |
| Public Browse Controller | console | SSR for featured profile/project pages |
| Public Checkout Controller | console | Serves information related to end-user checkout using the Payments Module |
| Public Controller | apps | Serves/verifies xrweb for loading the 8th Wall Engine |
| Public Image Targets Controller | apps | Serves runtime image targets to the 8th Wall Engine |
| Public Modules Controller | console | Serves information for publicly-available modules |
| PWA Controller | console | Updates PWA-related information for apps |
| Repos Controller | console | Validates and proxies git requests to studio-api/codecommit |
| Repos Private Controller | console | Serves development/published versions of source code from S3, for owners of the app |
| Repos Public Controller | console | Serves featured profile/project metadata, and serves source code for open source featured projects |
| Roles Controller | console | Manage members and roles of a workspace's team, and accept invitations to join other teams |
| Temp URL Controller | console | Fetch temporary shortlinks for apps launchable from their featured project page |
| Usage Controller | console | Fetch metrics for usage for an app |
| Users Controller | console | Manage user information |
| Users Public Controller | console | Handle initial signup flow for new users |
| Verify Unity Controller | apps, console | Respond to validation requests from the 8th Wall Unity Plugin |
| Websocket Controller | console | Issue credentials for developers within the Cloud Editor to access authenticated websocket channels |

## Database

TODO

## Building old commits

How to build an old commit on an <server> app.

1. Find the commit that you want to build
2. `go/lambda` and find `studio-deploy`.
3. Fill out a test JSON. You will need to:
   1. Fill in `commitId` of the build you want to deploy
   2. Fill in `repositoryName`. You can go to admin console and find the repo name by searching with your app's name
   3. Fill in `refHead` to `staging` or `public`.
4. Hit Test. You should see a build in your app for the `commitId` you specified.

Here is an example JSON:

```json
{
  "Records": [
    {
      "EventSource": "aws:sns",
      "EventVersion": "1.0",
      "EventSubscriptionArn": "arn:aws:sns:us-west-2:{{accountId}}:ExampleTopic",
      "Sns": {
        "Type": "Notification",
        "MessageId": "1234567890-1234567890-1234567890-1234567890",
        "TopicArn": "arn:aws:sns:us-west-2:123456789012:ExampleTopic",
        "Message": "BUILD_REQUEST",
        "MessageAttributes": {
          "repositoryName": {
            "Value": "8thwall.cubemap-aframe"
          },
          "commitId": {
            "Value": "959defa"
          },
          "refHead": {
            "Value": "staging"
          },
          "buildId": {
            "Value": "my-build-id"
          }
        }
      }
    }
  ]
}
```
