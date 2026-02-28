---
id: qr-8code
sidebar_position: 5
---

# QR 8Code

As a convenience, 8th Wall branded QR codes (aka "8 Codes") can be generated for a Project, making
it easy to scan from mobile device to access your WebAR project.  You are always welcome to generate
your own QR codes, or use third-party QR code generation websites or services.

The QR Code on the project dashboard points to a unique "8th.io" shortlink for your project. This
shortlink then redirects a user to the URL of your Web AR experience.

<u>Both the QR Code and "8th.io" code for a given project are static and will not change based on project type or license.</u>

### 8th Wall Hosted Projects (NO connected domain) {#8th-wall-hosted-projects-no-connected-domain}

If your project is using the default 8th Wall hosted URL (in the format of
"**workspace-name**.8thwall.app/**project-name**"), the QR Code and 8th.io shortlink will always
redirect to the default URL.  It it not possible to modify the destination URL.

![ProjectDashboard8wHostedQR](/images/console-appkey-qrcode-8w-hosted.png)

### 8th Wall Hosted Projects (WITH connected domain) {#8th-wall-hosted-projects-with-connected-domain}

If you have configured a [connected domain](/account/projects/connected-domains/) for your 8th
Wall hosted project, you'll have the option to set the QR Code / Shortlink destination to either the
default URL of the project, or the primary connected domain.

Use the radio button to set your QR Code / Shortlink destination:

![ProjectDashboard8wHostedQRConnectedDomain](/images/console-appkey-qrcode-8w-hosted-connected-domain.png)

### Self Hosted Projects {#self-hosted-projects}

To generate a QR code and shortlink, enter the full URL to your self-hosted project and click **Save**:

![ProjectDashboardSelfHostedQR](/images/console-appkey-qrcode.png)

The generated QR code can be downloaded in either PNG or SVG format to be included on a website,
physical media, or other locations to make it easy for users to scan with their smartphones to visit
the self-hosted URL.  Click the pencil icon to edit the shortlink destination should the self-hosted
URL change in the future.

Example:

![ProjectDashboardSelfHostedQRResult](/images/console-appkey-qrcode-result.png)
