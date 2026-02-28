---
id: project-settings
---

# Project Settings

The Project Settings page allows you to:

* Set developer preferences, such as Keybindings and Dark mode
* Edit Project information:
  * Title
  * Description
  * Enable/Disable default splash screen
  * Update cover image
* Manage staging passcode
* Access the Project's App Key string
* Set engine version
* Unpublish app
* Temporarily disable project
* Delete project

## Code Editor Preferences {#code-editor-preferences}

The following Code Editor preferences can be set:

* Dark Mode (On/Off)
  * Use a darker color palette in the Code Editor that uses darker background colors and lighter foreground colors.
* Keybindings
  * Enable keybindings from popular text editors.  Select from:
    * Normal
    * Sublime
    * Vim
    * Emacs
    * VSCode

## Basic Information {#basic-information}

Project Settings allows you to edit the Basic Information for your Project

* Project Title
* Description
* [Enable or Disable the Default Splash Screen](/legacy/guides/projects/project-settings/#default-splash-screen)
* Update cover image

## Default Splash Screen {#default-splash-screen}

The Default Splash Screen is displayed at the beginning of each Web AR experience created using the
8th Wall Cloud Editor. It cannot be customized, however, it can be disabled for 
`Commercial projects` if you are on a paid `Pro` or `Enterprise` plan.

![DefaultSplashScreen](/images/default-splash-screen.jpg)

To Enable or Disable the Default Splash Screen:
1. Go to the `Project Settings` page.
2. Expand the `Basic Information` section.
3. Toggle `Default Splash Screen` (On/Off)

![DefaultSplashScreenToggle](/images/basic-information-splash-screen.jpg)

**Note:** All projects must still display the [Powered by 8th Wall](https://drive.google.com/drive/folders/1c9d23c5hS_HspHTUD7VceV6ocqdbPN7J?usp=sharing) 
badge on the loading page. It's included by default in the `Loading Module` and cannot be removed.
[Learn more about Customizing the Load Screen](/legacy/guides/advanced-topics/load-screen/).

## Staging Passcode {#staging-passcode}

When your app is staged to XXXXX.staging.8thwall.app (where XXXX represents your Workspace URL), it
is passcode protected.  In order to view the WebAR Project a user must first enter the passcode you
provide.  This is a great way to preview projects with clients or other stakeholders prior to
launching publicly.

A passcode should be 5 or more characters and can include letters (A-Z, lower or upper case),
numbers (0-9) and spaces.

## App Key {#app-key}

:::info
App Keys and self-hosting are only available on a [Custom Plan](https://8thwall.com/custom).
:::

Self-hosted Projects require an App Key to be added to the code.

To access the app key for a project:

1. [Create a Legacy Editor project](/legacy/guides/projects/create-legacy-editor-project/) and select **App Key** as the project type.

2. In the left navigation, select Project Settings:

![LeftNavProjectSettings](/images/left-nav-project-settings.jpg)

3. Scroll down to the **Self-Hosting** section of the page and expand the **My App Key** widget:

![ProjectSettingsMyAppKey](/images/project-settings-app-key.jpg)

4. Click the **Copy** button paste the App Key string into the `<script>` tag in the `<head>` of your self-hosted code

#### Example - App Key {#example---app-key}

```html
<!-- Replace the X's with your App Key -->
<script async src="//apps.8thwall.com/xrweb?appKey=XXXXX"></script>
```

## Engine Version {#engine-version}

You can specify the version of the 8th Wall engine used when serving public web clients (`Release`
or `Beta`).

Users viewing a published experience will always be served the most recent version of 8th Wall
Engine from that channel.

In general, 8th Wall recommends using the official **release** channel for production web apps.

If you would like to test your web app against a pre-release version of 8th Wall's Engine, which may
contain new features and/or bug fixes that haven't gone through full QA yet, you can switch to the
beta channel. Commercial experiences should not be launched on the beta channel.

#### Freezing Engine Version {#freezing-engine-version}

:::note
Engine version freezing is only available to **Commercial** projects with an active license.
:::

To **Freeze** the current engine version, select the desired Channel (release or beta) and click the **Freeze** button.

![EngineFreeze](/images/engine-freeze.png)

To **Re-join** a Channel and stay up-to-date, click the **Unfreeze** button.  This will **unfreeze**
the Engine Version associated with your Project and re-join a Channel (release or beta) to use the
latest version available to that channel.

![EngineUnfreeze](/images/engine-unfreeze.png)

## Unpublish App {#unpublish-app}

Unpublishing your project will remove it from staging (XXXXX.staging.8thwall.app) or public (XXXXX.8thwall.app).

You can publish it again at any time from the Code Editor or Project History pages.

Click **Unpublish Staging** to take your Project down from XXXXX.staging.8thwall.app

Click **Unpublish Public** to take your Project down from XXXXX.8thwall.app

## Temporarily Disable Project {#temporarily-disable-project}

If you disable your project, your app will not be viewable. Views will not be counted while disabled.

You will still be charged for any active commercial licenses on projects that are temporarily disabled.

Toggle the slider to Disable / Enable your project.

## Delete Project {#delete-project}

A project with a commercial license cannot be deleted. Visit the
[Account page](/legacy/guides/account-settings#manage-commercial-licenses) to cancel an active
commercial project.

Deleting an Project will cause it to stop working. You cannot undo this operation.
