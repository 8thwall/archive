---
id: quick-start-guide
---

# Quick Start Guide

This guide provides the steps required to get you up and running with the Niantic 8th Wall
**Studio** and **Cloud Editor**.

<iframe width="640" height="385" src="https://www.youtube.com/embed/F5GzshW6tsM?si=vOKxDOQN4Naq2CUy" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Create an 8th Wall Account {#create-an-8th-wall-account}

Creating an 8th Wall Account gives you the ability to:

* **Create** rich Web AR and Web VR experiences and 3D web games that run directly in a mobile web browser.
* Use our **visual tooling** and game engine.
* **Collaborate** with team members and store code in source control.
* Instantly **preview** projects as you develop.
* Wirelessly **debug** your code in real time with live console logs from multiple devices.
* **Publish** projects hosted on 8th Wall's global network.
* Manage subscriptions, billing information and licenses for commercial projects.
* Create a **Public Profile** and **Feature Projects** on 8thwall.com, allowing you to showcase your
work, live demos, and/or code.

**New Users**: Start creating for free at https://8thwall.com/get-started 

**Existing Users**: Login at <https://www.8thwall.com/login>

## Create for Free {#create-for-free}

The Niantic 8th Wall Studio and Built-in Hosting platform is available to all for free and Cloud
Editor is available to workspaces with a paid subscription. 8th Wall offers a free Basic plan so you
can get access to the full power of 8th Wall and begin building WebAR experiences, no credit card
required.

Commercial or branded work requires a Pro plan and commercial license  8th Wall subscriptions and
licenses automatically renew until you cancel. There are no refunds or credits for partial or unused
months. To manage your subscription settings, please see
[Account Settings Guide](/legacy/guides/account-settings)

1. From the 8th Wall Homepage or Pricing page, click **Create for Free**

2. Create your account by entering your Name, Email and Password or use a social login. Review and
confirm: Accept the 8th Wall [Terms and Conditions](https://www.8thwall.com/terms) and then click
**Next**.

![TrialCreateAccount](/images/trial-create-account.jpg)

3. Confirm your email address. An email will be sent with a verification code. Enter the
verification code and click **Confirm**.

![TrialConfirmEmail](/images/trial-confirm-email.jpg)

4. Click **Continue** to complete account creation.

## Create your workspace {#create-your-workspace}

1. Optional: add a profile image - this will be viewed publicly.

2. Enter a Workspace Name. This value is for display purposes only and doesn't impact any URLs
associated with your workspace.

3. Select what you are using Niantic 8th Wall for.

4. Select what best describes your Role.

5. Enter a Workspace URL. Pick something relevant for your workspace name, such as the name of your
company.

**IMPORTANT**: This value will be used as the default **sub-domain** for **ALL** 8th Wall hosted
projects in your account (e.g. **mycompany**.8thwall.app/project-name). This value will also be used
in your Public Profile page URL (e.g. www.8thwall.com/**mycompany**).

**You cannot change this value later, so choose wisely!**

<!-- ![CreateYourWorkspace](/images/todo.jpg) -->

Note: if you want to connect custom domains to your 8th Wall hosted projects to override the default
URL, please see [here](/legacy/guides/projects/connected-domains).

## Start a new project {#start-a-new-project}

1. From the Homepage (logged in) or Workspace Dashboard, click "Start a new Project"

![StartNewProject](/images/console-workspace-start-project.jpg)

2. **Select Hosting Type** (Pro/Enterprise plans only): Decide up front if the project will be using 
8th Wall Studio or the Legacy Editor. Both Studio and Editor are hosted by 8th Wall. Alternatively,
users on the Enterprise of Legacy Pro Plan can choose self-hosting. This setting cannot be changed later.

3. **Select a Project Name**:  The project name is used both in th default project URL (e.g.
`mycompany.8thwall.app/project-name`) as well as the Featured Project page URL (e.g.
`www.8thwall.com/mycompany/project-name`).  **It cannot be changed later**.

4. **Select a License Type** (Pro/Enterprise only)

![NewProjectBasicInfo](/images/gettingstarted-new-project-info.png)

License Types:

* **Commercial**: Commercial projects are intended for commercial use. When you’re ready to launch a
commercial project so that the world can see it, you will need to purchase a Commercial
License. Please refer to the [Pricing Page](https://www.8thwall.com/pricing#commercial-license) on
the website for commercial license options. NOTE: In order to purchase a commercial license, the
workspace must first have an active Pro plan.

* **Demo Use**: You may create unlimited demo projects which are publicly viewable and strictly
intended for pitching prospective work. A "Demo Use Only" label will appear on the loading screen.
If you decide to commercialize your project at any point, switch to "Commercial" in the Project
Dashboard.

* **Web App**: You may create unlimited first-party projects under this license. Web app projects
require the splash screen to remain on and will be publicly viewable on 8thwall.com as soon as you
publish. **This license does not permit projects created for work-for-hire as they require a
Commercial license.**

**All projects** must display the [Powered by 8th Wall](https://drive.google.com/drive/folders/1c9d23c5hS_HspHTUD7VceV6ocqdbPN7J?usp=sharing) 
badge on the loading page. It's included by default in the `Loading Module` and cannot be removed.
Please see [here](/legacy/guides/advanced-topics/load-screen/) for instructions on customizing the Load Screen.

## Clone template project {#clone-template-project}

1. After creating a project, select a template to clone.  In this guide, select **"A-Frame: Tap to
Place Ground"**.  This interactive example allows the user to spawn 3D models on the surface in
front of you by tapping. This showcases raycasting, instantiating objects, importing 3D models and
the animation system.

![EditorCloneProject](/images/editor-clone-project.jpg)

2. On the following screen, a project README will be displayed. [Optional] To test out the template
before cloning, click the **Launch** button and scan the QR code with your phone.

3. Click the **Clone Project** button to proceed.  The sample project will be cloned into your
workspace, and the Cloud Editor will be opened.

## Simulator {#simulator}

1. The Simulator lets you test and view project changes across different device viewport sizes and
simulated real-world scenes without needing to leave the Cloud Editor. The Simulator works by
running the 8th Wall AR Engine in realtime on top of the included collection of pre-recorded AR
sequences. You can access the Simulator using the Preview button at the top of the Cloud Editor
window and select the Simulator option. You may open as many Simulator instances as you want,
allowing you to test project changes across a diverse range of scenarios. **Note: Certain AR
features like Sky Effects, VPS, custom Image Targets, and Inline AR cannot be simulated at this
time.**

![SimulatorFullScreen](/images/simulator-full-screen.jpg)

2. You can simulate your experience across a range of different AR sequences that let you test Face
Effects, Hand Tracking, World Effects, Absolute Scale, Shared AR, and more. An AR sequence includes
both video recording data and device gyroscope or orientation recorded data so that you can simulate
AR. Use the bottom left Sequence Selection menu to change the AR sequence. You can use the carousel
to switch between options in the sequence category. Pausing the sequence only pauses the video,
allowing you to test changes at the same frame. Drag the playback handles to set in/out loop points.

![SimulatorSequenceSelector](/images/simulator-sequence-selector.jpg)

3. Live View follows the same logic as your project's XR8 configuration, allowing you to simulate
your project using the feed from your desktop instead of a pre-recorded AR sequence. For example, if
your project uses Face Effects and you have the Cloud Editor open on desktop, it will open your
desktop camera but if you are developing a World Tracking experience and "allowedDevices: any" is
enabled in your project, you should see Metaversal Deployment’s “desktop mode”. Note: Live View in
the Simulator may prompt you to enable camera, microphone, or location permissions depending on what
is enabled in your project. Click Allow for permission prompts in order to see your experience in
Live View.

4. Your project might look different on different devices due to differences in the mobile web
viewport size. Or you may want to see your project in both landscape and portrait mode. At the top
left of the Simulator, you can choose from a set of common device viewport sizes, change the
orientation, or use responsive mode to adjust to a custom size. You can also double click the edges
of the Simulator panel to automatically fit the Simulator to the width of the selected device
viewport. **Note: Dimensions are presented in CSS logical pixels (AKA viewport dimensions), not
physical device pixels. When selecting a device from the selector, only the viewport dimensions
will be updated, not the user agent of the client.**

![SimulatorDeviceSelector](/images/simulator-device-selector.jpg)

5. The Simulator has a number of playback controls and convenience features like:
  * Play bar, scrubber and in/out handles: Allow you to set up loop points, giving you granular
  control over the selected sequence.
  * Recenter button (bottom right): Calls `XR8.XrController.recenter()`, which recenters the camera
  feed to its origin. **NOTE: Recenter is also called each time the sequence loops and each time a
  new sequence is selected.**
  * Refresh button (top right): Refreshes the page, retaining cached content. Holding SHIFT and
  clicking the refresh button will perform a full reload, ignoring any cached content.


## Live Preview {#live-preview}

1. At the top of the Cloud Editor window, click the **Preview** button.

2. Scan the QR code with your mobile device to open a web browser and look at a live preview of the WebAR project.

![GettingStartedPreview](/images/editor-preview.jpg)

3. When the page loads, you'll be prompted for access to motion and orientation sensors (on some
devices) and the camera (all devices).  Click **Allow** for all permission prompts.  You will be
taken to the private development URL for this project.

**Note**: The "Preview" QR code displayed within the Cloud Editor is a **temporary, one-time use QR
code** only meant for use by the developer while actively working in the Cloud Editor. This QR code
takes you to a private, development URL, and isn't accessible by others. To share your work with
others, please see the section below on **Publishing your project**.

4. When the WebAR preview loads, tap on the surface in front of you to spawn 3D models.

5. Result:

![PlaceGround](/images/screenshot-tap.jpg)

## Save, Build and Land {#save-build-and-land}

At this point, you have a fully operational Web AR project and have previewed it on a mobile device.
Next, make a very small code change to illustrate how to update the project, preview the new code,
and land the changes into source control.

1. Within `body.html` of the Cloud Editor project, make a small text change to the `promptText`. For
example, simply change the text from `Tap To Place Model` to `Tap To Begin`.

2. Click `Save + Build` to save your work and initiate a new cloud build of your project.

![SaveBuild](/images/screenshot-update.jpg)

3. If your mobile browser is still open from scanning the **Preview** QR code in Step 2, your phone
will automatically reload once the build completes. If the mobile browser page is no longer open,
scan the Preview QR code again to preview your updates to the project.

4. Once satisfied with your changes, **land** the updated code into the Cloud Editor's integrated
source control. At the top-right of the Cloud Editor window, click **Land**. The button will be
green, indicating that there are changes in the project that have not yet been landed into source
control:

![LandUpdates](/images/cloud-editor-land.jpg)

5. In the **Message** field enter a brief message describing the changes made, then click **Land**:

![LandReview](/images/cloud-editor-land-review.jpg)

## Publish your project {#publish-your-project}

The final step is to **publish** your updated and landed project code using 8th Wall's Built-in
Hosting. This allows the project to be viewed publicly by anyone on the internet.

Note: Commercial projects require additional commercial licenses when launched. See
<https://www.8thwall.com/pricing> for more info.

**All projects** must display the [Powered by 8th Wall](https://drive.google.com/drive/folders/1c9d23c5hS_HspHTUD7VceV6ocqdbPN7J?usp=sharing) 
badge on the loading page. It's included by default in the `Loading Module` and cannot be removed.
Please see [here](/legacy/guides/advanced-topics/load-screen/) for instructions on customizing the Load Screen.

1. At the top right of the Cloud Editor window, click **Publish**

![CloudEditorPublishButton](/images/cloud-editor-publish.jpg)

2. In the **Publish Project** modal, you will see a list of commits (one for each version of code
you have landed into source control) as well as the Development, Staging and Public URLs for the
project.  Select top radio button in the **Public** column to deploy the latest/newest version of
code to the project's Public URL, then click **Publish**:

![GettingStartedPublish](/images/editor-publish-project.jpg)

3. Complete the publish process by giving your project a title, description and cover image. This
info will appear on your Featured Project Page and as a preview when you share on social platforms
and messaging apps.

![GettingStartedFinishPublish](/images/editor-finish-publishing.jpg)

## View the public project {#view-the-public-project}

1. Go back to the Project Dashboard in the left navigation.  In the **QR 8.code** section, the
Public project URL will be displayed along with both an **8th.io** shortlink and associated QR code.

2. Scan the QR code with your mobile device to view the Public Web AR experience.

![ProjectDashboard8wHostedQR](/images/console-appkey-qrcode-8w-hosted.png)
