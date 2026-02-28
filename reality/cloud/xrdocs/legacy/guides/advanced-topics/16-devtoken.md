---
id: device-authorization
---
# Device Authorization

If you are on a paid Pro or Enteprise plan, you gain the ability to self-host WebAR experiences. If
the IP or domains(s) of your webserver that haven't been whitelisted (see
[Self Hosted Domains](/legacy/guides/projects/self-hosted-domains) section of the documentation), you will
need to authorize your device in order to view the experience.

If you are using the Cloud Editor, there is no need to authorize devices.  The Cloud Editor
automatically authorizes devices  when you scan the Preview QR code during development.

Authorizing a device installs a Developer Token (cookie) into its web browser, allowing it to view
any app key within the current workspace.

There is no limit to the number of devices that can be authorized, but each device needs to be
authorized individually. Views of your Web AR experience from authorized devices count toward your
monthly usage total.

**IMPORTANT**: If you have followed the steps below on an **iOS device**, and are still having
issues, please see the [Troubleshooting](/legacy/troubleshooting/device-not-authorized) section for steps
to fix. Safari has a feature called **Intelligent Tracking Prevention** that can **block third party
cookies** (what we use to authorize your device while you're developing). When they get blocked, we
can't verify your device.

How to authorize a device:

1. Login to 8thwall.com and select a Project within your workspace.

2. Click **Device Authorization** to expand the device authorization pane.

3. Select 8th Wall Engine version to use during development.  To use the latest stable version of
8th Wall, select **release**.  To test against a pre-release version, select **beta**.

![ConsoleDeveloperModeChannel](/images/console-developer-mode-channel.jpg)

4. Authorize your device:

**From Desktop**: If you are logged into the console on your laptop/desktop, **Scan the QR code**
from the **device you wish to authorize**.  This installs an authorization cookie on the device.

Note: A QR code can only be scanned once.  After scanning, you will receive confirmation that your
device has been authorized. The console will then generate a new QR code that can be scanned to
authorize another device.

Before:

![ConsoleDevTokenQR](/images/console-developer-mode-qr.jpg)

After:

Confirmation (Console) | Confirmation (On Device)
---------------------- | ------------------------
![ConsoleQRConfirmation](/images/console-developer-mode-qr-result-desktop.jpg) | ![MobileQRConfirmation](/images/console-developer-mode-qr-result-mobile.jpg)

**From Mobile**: If you are logged into 8thwall.com directly on the mobile device you wish to
authorize, simply click **Authorize browser**. Doing so installs an authorization cookie into your
mobile browser, authorizing it to view any project within the current workspace.

Before:

![DeveloperModeMobile](/images/console-developer-mode-mobile.jpg)

After:

![DeveloperModeMobileAuthorized](/images/console-developer-mode-mobile-authorized.jpg)
