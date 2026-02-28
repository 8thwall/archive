---
id: troubleshooting
description: This section explains limitations and known issues of the 8th Wall Desktop App.
sidebar_position: 3
---

# Troubleshooting

:::info[Public Beta]
The **8th Wall desktop app is in Public Beta** and functionality may change in a future release. Your feedback is appreciated and we have a [dedicated support forum for the desktop app beta users](https://forum.8thwall.com/c/desktop-beta/17)–please report any issues you encounter or suggestions here.
:::

## Limitations

- Project directories can not be hosted on an external server, they must use 8th Wall’s build and hosting process.

## Known Issues

- Modules are not supported at this time.
- Modifying asset bundles is not supported at this time.
- Projects cannot be set up or opened if the name of the project matches an existing project that was previously set up. This scenario may happen if you are a member of multiple workspaces with different projects that share the same name.  
- External (shared) projects cannot be opened in the desktop app. Learn more about external project sharing [here](/account/projects/project-sharing/).  
- Switching clients while the simulator is running will cause the simulator to infinitely hang in the "Initializing" state. You can close the project and reopen it if you enter this state.

## Reload

You can relead and force reload the 8th Wall Desktop App from the **View** menu or using keyboard shortcuts.

![](/images/studio/app/view-options.jpg)
