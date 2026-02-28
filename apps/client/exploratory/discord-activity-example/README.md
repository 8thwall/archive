# Discord Activity Example

This exploratory project demonstrates how to set up a discord activity with an arbitrary client.

[Building Your First Discord Activity](https://discord.com/developers/docs/activities/building-an-activity#introduction)

The [Discord Activity Example](https://www.8thwall.com/8thwall/discord-activity-example/project) in the 8thwall Workspace is a good starter template for interacting with the Discord Embedded API from a client. It displays the names and profile pictures of users in the current session.

## Set up

In order to run a web client in Discord, you'll need to set up an account and create an app in the developer hub.

Follow the instructions below to get started with a new application.

### Creating New Application

1. Create a Discord Account and navigate to https://discord.com/developers/applications

2. Create a new application by clicking the Button in the top right corner
    1. Enter a name for the application and accept the terms of service

3. Go to the **OAuth2** page, under the **Settings** section:
    1. Add `http://127.0.0.1` as a redirect URI for testing.
    2. Save the `Client ID` somewhere secure.
    3. Click "Reset Secret" to retrieve the `Client Secret` and store it somewhere safe.
    4. Press "Save" to keep your settings.

4. Navigate to the **URL Mappings** page, under the **Activities** section:
    1. Add a temporary target to the root mapping like `127.0.0.1:8888`. This will be replaced later with your public URL, but it's required to enable Activities in the next step.

5. Go to the **Settings** page, under the **Activities** section:
    1. Toggle **Enable Activities** and accept the app launcher agreement.

6. Then, go to the **Installation** tab, under the **Settings** section:
    1. Copy the link from the **Install Link** panel and open it in your browser.
    2. Install the application to make it accessible in any server or DM.

### Launching an Application

1. Run the `serve-project.sh` script:
    1. Enter the `Client ID` and `Client Secret` from your Discord application when prompted
    2. Wait for `html-app-packager` to create the HTML export bundle
    3. The server will start hosting the project at http://localhost:8888
    4. Visit http://localhost:8888 to verify your project loads correctly.

2. Use `cloudflared` to create a tunnel, so the project will be publicly accessible over the internet.
    1. `brew install cloudflared` to download the `cloudflared` CLI tool
    2. Run `cloudflared tunnel --url http://localhost:8888`.
    3. Make note of the URL that was generated.

    Example:
    ```
    2025-10-11T03:05:16Z INF +--------------------------------------------------------------------------------------------+
    2025-10-11T03:05:16Z INF |  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
    2025-10-11T03:05:16Z INF |  https://sporting-follow-audit-href.trycloudflare.com                                      |
    2025-10-11T03:05:16Z INF +--------------------------------------------------------------------------------------------+
    ```
    4. Open the `cloudflared` URL in your browser to make sure the project loads.

3. Update your Discord application settings:
    1. Open the Discord Developer Portal and navigate to your application
    2. Go to **URL Mappings** under the **Activities** section
    3. Replace the temporary target with your `cloudflared` URL for the **Root Mapping**

4. Test your Discord Activity:
    1. Open Discord and navigate to any DM or server
    2. Click the activities icon (game controller) in the voice channel controls
    3. Find and click your application in the **Apps & Commands** panel

### How app.ts Works

While you can host a static client in Discord's iframe, interacting with the [discord-embedded-app-sdk](https://discord.com/developers/docs/developer-tools/embedded-app-sdk) requires authentication with Discord's [OAuth2 APIs](https://discord.com/developers/docs/topics/oauth2#oauth2). Since storing credentials client-side is insecure, we use a backend server that:

- Reads sensitive data from environment variables
- Handles OAuth requests on behalf of the client
- Provides a secure `/api/token` endpoint for authentication

When the client needs Discord authentication, it makes a request to our server, which then securely communicates with Discord's OAuth API.
