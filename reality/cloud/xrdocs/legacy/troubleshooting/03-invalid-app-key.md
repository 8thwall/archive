---
id: invalid-app-key
---
# Invalid App Key

Issue: When trying to view my Web App, I receive an **"Invalid App Key"** or **"Domain Not Authorized"** error message.

Troubleshooting steps:

1. Verify your app key was pasted properly into source code.
2. Verify you are connecting to your web app via **https**.  This is required by mobile browsers for camera access.
3. Verify you are using a supported browser, see [Web Browser Requirements](/legacy/getting-started/requirements/#web-browser-requirements)
4. If self-hosting, verify your device has been properly authorized.  On your phone, visit <https://apps.8thwall.com/token> to view device authorization status. This is not required if you have configured [Self Hosted Domains](/legacy/guides/projects/self-hosted-domains).
5. If you are a member of multiple Web Developer workspaces, make sure that the App Key and Dev Token are from the **same workspace**.
6. If your web browser is in Private Browsing or Incognito mode, please exit Private/Incognito mode, re-authorize your device, and try again.
7. Clear website data & cookies from your web browser, re-authorize your device, and try again.
8. If you are on a paid Pro or Enterprise plan and are trying to access your WebAR experience publicly, make sure that [Self Hosted Domains](/legacy/guides/projects/self-hosted-domains) are configured properly.
