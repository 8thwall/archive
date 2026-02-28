---
id: project-settings
sidebar_position: 8
---

# Project Settings

The Project Settings page allows you to:

* Set developer preferences, such as Keybindings and Dark mode
* Edit Project information:
  * Title
  * Description
  * Update cover image
* Manage staging passcode
* Access the Project's App Key string (**self-hosted only**)
* Freeze engine version (**active white-label subscription only**)
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
* Update cover image

<!-- ## Default Splash Screen {#default-splash-screen}

The Default Splash Screen is displayed at the beginning of each Web AR experience created using the
8th Wall Cloud Editor. It cannot be customized, however, it can be disabled by purchasing a white label subscription.

![DefaultSplashScreen](/images/default-splash-screen.jpg)

To Enable or Disable the Default Splash Screen:
1. Go to the `Project Settings` page.
2. Expand the `Basic Information` section.
3. Toggle `Default Splash Screen` (On/Off)

![DefaultSplashScreenToggle](/images/basic-information-splash-screen.jpg) -->

## Staging Passcode {#staging-passcode}

When your app is staged to XXXXX.staging.8thwall.app (where XXXX represents your Workspace URL), it
is passcode protected.  In order to view the WebAR Project a user must first enter the passcode you
provide.  This is a great way to preview projects with clients or other stakeholders prior to
launching publicly.

A passcode should be 5 or more characters and can include letters (A-Z, lower or upper case),
numbers (0-9) and spaces.

## Engine Version {#engine-version}

You can specify the version of the 8th Wall engine used when serving public web clients (`Release`
or `Beta`).

Users viewing a published experience will always be served the most recent version of 8th Wall
Engine from that channel.

In general, 8th Wall recommends using the official **release** channel for production web apps.

If you would like to test your web app against a pre-release version of 8th Wall's Engine, which may
contain new features and/or bug fixes that haven't gone through full QA yet, you can switch to the
beta channel. Commercial experiences should not be launched on the beta channel.

### Freezing Engine Version {#freezing-engine-version}

:::info
Engine version freezing is only available to projects with an active white label subscription.
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

A project with a white label subscription cannot be deleted. Visit the
Account page to cancel an active white label subscription.

Deleting an Project will cause it to stop working. You cannot undo this operation.
