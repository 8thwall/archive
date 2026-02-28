---
id: device-not-authorized
---
# Device Not Authorized

Issue: When trying to view my Web App, I receive a "Device Not Authorized" error message.

#### Safari specific {#safari-specific}

The situation:

- While viewing your project, you see 'Device not Authorized' alerts, **but**
- [apps.8thwall.com/token](https://apps.8thwall.com/token) shows the correct authorization.

Why does this happen?

Safari has a feature called Intelligent Tracking Prevention that can block third party cookies (what we use to authorize your device while you're developing). When they get blocked, we can't verify your device.

Steps to fix:

1. Close Safari
1. Turn off Intelligent Tracking Prevention at `Settings>Safari>Prevent Cross-Site Tracking`
1. Clear 8th Wall cookies at `Settings>Safari>Advanced>Website Data>8thwall.com`
1. Reauthorize from console
1. Check your project
1. If not fixed: Clear all cookies at `Settings>Safari>Clear History and Website Data`
1. Reauthorize from console

#### Otherwise {#otherwise}

See [Invalid App Key](/legacy/troubleshooting/invalid-app-key) steps from #5 onwards for more troubleshooting.
