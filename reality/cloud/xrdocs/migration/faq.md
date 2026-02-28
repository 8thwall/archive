---
id: faq
sidebar_position: 999
---

# FAQ

## What’s Happening

### What is happening with 8th Wall?
All 8th Wall products and services — including Studio, Cloud Editor, and Asset Lab — will be discontinued over the coming year. In the meantime, we are actively exploring options to open source key components of the 8th Wall technology and documentation so the creativity built on 8th Wall can continue to thrive in the developer community.

While the hosted 8th Wall platform will eventually wind down, core parts of its engine, SDK, and documentation will be released for public use.

### What does it mean for 8th Wall to open source?
Going open source means 8th Wall’s core technology — including parts of its engine, SDK, and supporting documentation — will be publicly available for developers to use, modify, and build upon. Rather than a closed, hosted platform, 8th Wall will live on as community-driven code.

This transition ensures the technology continues to evolve in the hands of the developers, artists, and creators who shaped it.

### Which parts of 8th Wall will be open sourced?
We plan to release key parts of the 8th Wall engine, SDK, and developer tools as open-source projects. This includes core AR systems, documentation, sample projects, and more.

Not every hosted component can be maintained long-term, but we aim to release the building blocks that matter most. Specific repositories and contribution guidelines will be shared as they become available.

---

## Key Dates and Access

### What’s the timeline for this transition?
We’re shifting to open source gradually to give developers time to export projects and access documentation.

| Date | What Happens |
|---------|-------------------|
| February 28, 2026 | End of platform access. All accounts lose the ability to create, edit, publish, or export projects. |
| Feb 28, 2026 – Feb 28, 2027 | All hosted projects and experiences remain live and accessible. |
| After Feb 28, 2027 | Hosting services will be decommissioned and project data deleted per retention policy. |

### Will I still be able to log in or access my projects after February 28, 2026?
No. After February 28, 2026, you will no longer be able to log in to the 8th Wall platform. Hosted projects will remain live through **February 28, 2027**, but you will not be able to export them.

---

## Projects, Hosting, and Data

### Will my hosted projects stay live?
Yes. All 8th Wall hosted projects and experiences will remain live through **February 28, 2027**. After that, hosting services will be shut down.

### Can I download my projects and assets?
Yes. More details and instructions will be shared soon.

### What happens to externally linked assets or embedded experiences?
Assets and hosted URLs will continue functioning through **February 28, 2027**. After that, they will stop serving content. Any embedded 8th Wall projects will need to be re-hosted.

### Will there be documentation or tools to help with migration?
Yes. We will release documentation, export utilities, and examples to support developers in self-hosting or rebuilding projects using the open-source version.

### What’s the plan for data retention and deletion?
All developer and billing data will be permanently deleted after the decommission date. Please download any data you wish to keep before that time.

---

## Billing and Accounts

### When will billing and new subscriptions stop?
We have paused new annual contracts and are no longer accepting new paid sign-ups. Existing subscriptions, including month-to-month plans, will continue until February 28, 2026, when editing access ends and recurring billing stops automatically.

### What happens to my active subscription?
All paid accounts will automatically end by February 28, 2026.
If you prepaid for time beyond that date, you will receive a prorated refund.
You’ll retain dashboard and export access until that date.

### What about enterprise or custom agreements?
Our team will contact enterprise and custom customers directly to coordinate transitions. For additional questions, reach out to billing@8thwall.com.


### Will I still be able to access my billing or account history?
Yes. You will be able to access billing receipts and account details through February 28, 2026.

### What happens to my data after billing ends?
All developer and billing data will be permanently deleted after decommissioning. Download anything you need before that date.

---

## Community and Support

### What support and community channels will remain active during this period?
We aim to keep the 8th Wall Forum, Discord, and social channels active and monitored through the transition period.

### What if I need help exporting or archiving my projects?
We’ll continue providing export guides and documentation updates throughout 2026.
Support is available through the [community discord](https://8th.io/discord) or at support@8thwall.com.


### Will the Forum eventually close?
Eventually, yes—but not immediately. We’ll provide advance notice before any changes to support channels occur.

---

## Distributed Engine Binary

### What is the distributed engine binary?
The distributed engine binary is a closed-source release of the 8th Wall Engine, including SLAM and core AR capabilities. It allows developers to continue building AR experiences outside of the hosted platform.

### Why is the engine released as a binary instead of open source?
8th Wall’s core AR capabilities rely on proprietary computer vision and tracking technology that cannot be open sourced. Releasing the engine as a binary allows continued use of these capabilities while protecting underlying IP and licensed technologies.

### What license will the distributed 8th Wall Engine binary use?
We’re still finalizing details around the distribution of the 8th Wall Engine binary. When the binary is released, its use will be governed by the distribution license included with the binary.

That license will define how the engine can be used, distributed, and integrated into projects. We’ll share more details once the license is finalized and the binary is available.

### What’s included in the engine binary?
The distributed engine binary includes the core AR capabilities that power 8th Wall experiences, including:
* World Effects
* Face Effects
* Image Targets
* Sky Effects
* Absolute Scale

### How long will the engine binary be maintained?
The engine binary will be maintained through March 2026 to support a stable transition.

### What’s not included in the engine binary?
The engine binary does not include:
* Source code access
* The ability to modify or recompile the engine
* Niantic Spatial products such as VPS, Lightship Maps, or the Geospatial Browser
* Hand Tracking

---

## Open Source Plans

### What parts of 8th Wall will be open sourced?
Components that are not tied to SLAM or proprietary computer vision will be open sourced. Planned components include:
* 8th Wall Desktop App
* Standalone Runtime / ECS
* Non-SLAM AR features
* Developer tools such as 8th Wall Agent MCP Server and Image Target Processor
* Documentation and sample projects

### What will not be open sourced?
The following will not be open sourced:
* Engine internals (provided via the binary instead)
* Hand Tracking
* Niantic Spatial products (VPS, Geospatial Browser, and Maps)

---

## Niantic Spatial Products (VPS, Geospatial Browser, Maps)

### Can I use Niantic Spatial VPS with the distributed engine binary?
No. Niantic Spatial VPS (also known as Lightship VPS for Web) is not included in the distributed engine binary.

### Can I launch new projects using Niantic Spatial VPS after February 28, 2026?
Projects created using the distributed engine binary and open source tools will not support Niantic Spatial VPS on the Web. Hosted projects launched before February 28, 2026 that use Niantic VPS will continue to be supported through **February 28, 2027**.

### Will Lightship Maps or the Geospatial Browser be available after the transition?
Lightship Maps and the Geospatial Browser are not part of the 8th Wall open source transition. The Geospatial Browser will also be removed from the Desktop App as part of this change.
